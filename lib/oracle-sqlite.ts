// Oracle → SQLite translation layer.
//
// Students type REAL Oracle SQL (VARCHAR2, MINUS, TO_DATE, SYSDATE, DUAL...).
// We rewrite it into equivalent SQLite so it can actually execute in the
// browser. Nothing is faked: the query really runs, real rows come back,
// real errors surface — we just translate the dialect.
//
// Also turns cryptic engine errors into plain English a beginner can act on.

export type Translation = { sql: string; notes: string[] }

// ---------- helpers ----------
// Split SQL into string-literal and code segments so we never rewrite
// anything inside quotes (a column named 'MINUS PRICE' must stay intact).
function mapOutsideStrings(sql: string, fn: (chunk: string) => string): string {
  const parts = sql.split(/('(?:[^']|'')*')/g)
  return parts.map((p, i) => (i % 2 === 1 ? p : fn(p))).join('')
}

// ---------- the translation rules ----------
export function toSQLite(oracleSql: string): Translation {
  const notes: string[] = []
  let sql = oracleSql

  // PRE-PASS: TO_DATE('01-JAN-92','DD-MON-YY') → '01-JAN-92'
  // Done on the whole string, because the string-splitter below would break
  // the function call apart (its args are quoted literals).
  sql = sql.replace(
    /\bTO_DATE\s*\(\s*('(?:[^']|'')*')\s*(?:,\s*'(?:[^']|'')*'\s*)?\)/gi,
    '$1'
  )

  sql = mapOutsideStrings(sql, (c) => {
    let s = c

    // --- data types ---
    s = s.replace(/\bVARCHAR2\s*\(\s*\d+\s*(?:BYTE|CHAR)?\s*\)/gi, 'TEXT')
    s = s.replace(/\bVARCHAR\s*\(\s*\d+\s*\)/gi, 'TEXT')
    s = s.replace(/\bCHAR\s*\(\s*\d+\s*\)/gi, 'TEXT')
    s = s.replace(/\bCLOB\b/gi, 'TEXT')
    s = s.replace(/\bNUMBER\s*\(\s*\d+\s*,\s*\d+\s*\)/gi, 'REAL')
    s = s.replace(/\bNUMBER\s*\(\s*\d+\s*\)/gi, 'INTEGER')
    s = s.replace(/\bNUMBER\b/gi, 'NUMERIC')
    s = s.replace(/\bINTEGER\b/gi, 'INTEGER')
    s = s.replace(/\bDATE\b(?!\s*\()/gi, 'TEXT') // DATE type → TEXT (ISO strings)

    // --- set operators ---
    s = s.replace(/\bMINUS\b/gi, 'EXCEPT')

    // --- ALTER TABLE MODIFY (Oracle) → SQLite can't change a column type,
    //     so we translate the common "add/modify column" shapes it can do and
    //     leave a note for the rest. ADD (col type) → ADD COLUMN col type. ---
    s = s.replace(/\bALTER\s+TABLE\s+(\w+)\s+ADD\s*\(\s*(\w+)\s+([^)]+)\)/gi,
                  'ALTER TABLE $1 ADD COLUMN $2 $3')
    s = s.replace(/\bALTER\s+TABLE\s+(\w+)\s+ADD\s+(\w+)\s+(TEXT|INTEGER|REAL|NUMERIC)/gi,
                  'ALTER TABLE $1 ADD COLUMN $2 $3')

    // --- functions ---
    // NOTE: TO_DATE is handled BEFORE chunk-splitting (see below) because its
    // arguments are quoted literals, which the splitter would separate.
    s = s.replace(/\bSYSDATE\b/gi, "date('now')")
    s = s.replace(/\bNVL\s*\(/gi, 'IFNULL(')
    s = s.replace(/\bSUBSTR\s*\(/gi, 'SUBSTR(')
    s = s.replace(/\|\|/g, '||') // concat is the same

    // --- DUAL: Oracle's one-row dummy table ---
    // SELECT 1 FROM DUAL  →  SELECT 1
    s = s.replace(/\bFROM\s+DUAL\b/gi, '')

    return s
  })

  // notes explaining what we changed (shown to the student, teaches the dialect)
  if (/VARCHAR2/i.test(oracleSql)) notes.push("VARCHAR2(n) is Oracle's text type. Here it runs as TEXT.")
  if (/\bMINUS\b/i.test(oracleSql)) notes.push("Oracle writes MINUS; standard SQL calls it EXCEPT. Same meaning.")
  if (/\bSYSDATE\b/i.test(oracleSql)) notes.push('SYSDATE is the current date in Oracle.')
  if (/\bFROM\s+DUAL\b/i.test(oracleSql)) notes.push('DUAL is Oracle’s one-row dummy table, used when you need a FROM but have no real table.')
  if (/\bNVL\s*\(/i.test(oracleSql)) notes.push('NVL(a, b) returns b when a is NULL — standard SQL calls it COALESCE.')

  return { sql: sql.trim(), notes }
}

// ---------- beginner-friendly errors ----------
// Map raw SQLite messages onto something a first-week student can act on.
export function humanizeError(raw: string, sql: string): string {
  const m = raw.toLowerCase()

  if (m.includes('no such table')) {
    const t = raw.match(/no such table:\s*(\w+)/i)?.[1]
    return `There's no table called "${t}". Check the spelling, or create it first with CREATE TABLE. Click a table in the schema panel to see what exists.`
  }
  if (m.includes('no such column')) {
    const c = raw.match(/no such column:\s*([\w.]+)/i)?.[1]
    return `There's no column called "${c}". Click your table in the schema panel on the right to see its exact column names.`
  }
  if (m.includes('syntax error')) {
    // try to point at the likely culprit
    if (/,\s*\)/.test(sql)) return 'Syntax error: you have a comma right before a closing bracket — remove that last comma.'
    if (/select[\s\S]*from[\s\S]*from/i.test(sql)) return 'Syntax error: it looks like you wrote FROM twice.'
    if (!/;/.test(sql.trim()) && sql.trim().split(/\s+/).length > 3) return 'Syntax error. Also check you ended the statement with a semicolon ;'
    if (/\bwere\b/i.test(sql)) return 'Syntax error: did you mean WHERE instead of WERE?'
    if (/\bform\b/i.test(sql)) return 'Syntax error: did you mean FROM instead of FORM?'
    return `Syntax error — SQLite could not understand the statement. Common causes: a missing comma between columns, an extra comma before ")", a misspelled keyword, or unbalanced brackets.`
  }
  if (m.includes('unique constraint failed')) {
    return 'That value already exists in a UNIQUE or PRIMARY KEY column. Primary keys must be different for every row.'
  }
  if (m.includes('not null constraint failed')) {
    const c = raw.match(/failed:\s*([\w.]+)/i)?.[1]
    return `The column "${c}" is NOT NULL, so it must be given a value — you can't leave it empty.`
  }
  if (m.includes('foreign key constraint failed')) {
    return "Foreign key violation: you're referencing a row in the parent table that doesn't exist. Insert the parent row first."
  }
  if (m.includes('datatype mismatch')) {
    return 'Datatype mismatch — you may be putting text into a number column, or vice versa. Text values need single quotes: \'Alice\'.'
  }
  if (m.includes('incomplete input')) {
    return 'The statement looks unfinished — you may have an unclosed bracket or an unclosed quote.'
  }
  return raw
}
