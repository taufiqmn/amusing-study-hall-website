-- ============================================================
-- GAUSS-JORDAN ELIMINATION — story lesson. Run in SQL Editor.
-- ============================================================

update public.lessons
set sections = $j$[
{
  "type": "story",
  "hero": {
    "eyebrow": "Matrix: Basic to Pro · Solving Systems",
    "title": "Gauss-Jordan Elimination",
    "sub": "Gaussian gets you a staircase and then you back-substitute. Gauss-Jordan pushes further — it makes every pivot a 1 with zeros above AND below, so the answers appear directly, no substitution needed."
  },
  "chapters": [
    {
      "tag": "01 · The difference",
      "title": "One step beyond Gaussian",
      "blocks": [
        {"b":"p","text":"Gaussian elimination stops at **Row Echelon Form** (zeros below each pivot) and then you back-substitute. Gauss-Jordan continues to **Reduced Row Echelon Form (RREF)**: it also clears ABOVE each pivot and scales every pivot to 1. The result reads the answer off directly."},
        {"b":"cards","items":[
          {"label":"Gaussian → REF","body":"[1 2 3 | a]\n[0 1 4 | b]\n[0 0 1 | c]","verdict":"zeros below pivots, then back-substitute"},
          {"label":"Gauss-Jordan → RREF","body":"[1 0 0 | x]\n[0 1 0 | y]\n[0 0 1 | z]","verdict":"identity on the left — answer is right there"}
        ]},
        {"b":"check","q":"What extra work does Gauss-Jordan do beyond Gaussian?","options":["Nothing","Clears entries ABOVE pivots and makes pivots 1","Only swaps rows","Uses decimals"],"correct":1,"explain":"It reduces fully to RREF — pivots become 1 with zeros above and below."}
      ]
    },
    {
      "tag": "02 · What IS reduced echelon form?",
      "title": "The RREF conditions",
      "blocks": [
        {"b":"p","text":"A matrix is in **Reduced Row Echelon Form** when it's already in echelon form PLUS:"},
        {"b":"list","items":[
          "Every pivot (leading entry) is exactly **1** (a 'leading 1').",
          "Each pivot is the ONLY non-zero entry in its column — zeros above it as well as below."]},
        {"b":"cards","items":[
          {"label":"✅ RREF","body":"[1 0 0 | 5]\n[0 1 0 | 3]\n[0 0 1 | -2]","verdict":"leading 1s, zeros above & below"},
          {"label":"❌ Only REF","body":"[1 2 0 | 5]\n[0 1 0 | 3]\n[0 0 1 | -2]","verdict":"the 2 above the second pivot must be cleared"}
        ]},
        {"b":"check","q":"Which is in REDUCED row echelon form?","options":["[1 0 | 4] / [0 1 | 7]","[1 3 | 4] / [0 1 | 7]","[2 0 | 4] / [0 1 | 7]","[1 0 | 4] / [0 2 | 7]"],"correct":0,"explain":"Only the first has leading 1s AND zeros in the rest of each pivot column. B has a 3 above a pivot; C's first pivot is 2 not 1; D's second pivot is 2 not 1."}
      ]
    },
    {
      "tag": "03 · The method",
      "title": "How to reach RREF",
      "blocks": [
        {"b":"list","items": [
          "First reach echelon form exactly like Gaussian (zeros below each pivot).",
          "Scale each pivot row so the pivot becomes 1: Rᵢ = Rᵢ ÷ pivot.",
          "Work UPWARD: use each leading 1 to clear the entries above it.",
          "Read the solution straight from the last column."]},
        {"b":"note","text":"Order matters for tidiness: get zeros below first (echelon), then normalize pivots to 1, then clear upward. Doing it in this order keeps the arithmetic — and the fractions — simplest."},
        {"b":"check","q":"After reaching a leading 1 in a pivot, Gauss-Jordan next clears…","options":["below it again","above it","the whole row","nothing"],"correct":1,"explain":"The entries ABOVE the leading 1 (echelon already handled below)."}
      ]
    },
    {
      "tag": "04 · Watch it reduce",
      "title": "All the way to the identity",
      "blocks": [
        {"b":"p","text":"Same engine, switched to **Reduced (G-J)** mode. Step through and watch it first make the staircase, then scale pivots to 1, then clear upward until the left side becomes the identity. Every row operation is written beside each duplicated matrix."},
        {"b":"interactive","name":"matrix-reducer","props":{"mode":"reduced"},"caption":"Load '3×3 system', keep it on Reduced (G-J), and step to the end. The last column is the answer — no back-substitution."},
        {"b":"check","q":"When the left block is the identity matrix, the last column holds…","options":["the pivots","the solution values","the determinant","nothing useful"],"correct":1,"explain":"Identity on the left means each row reads xᵢ = (last column) directly."}
      ]
    },
    {
      "tag": "05 · Read the answer",
      "title": "No back-substitution needed",
      "blocks": [
        {"b":"eq","text":"[1 0 0 | 5]\n[0 1 0 | 3]\n[0 0 1 | -2]\n\n→  x = 5,  y = 3,  z = -2"},
        {"b":"p","text":"That's the payoff: once the coefficient part is the identity, each variable equals its constant on the right. Gauss-Jordan trades a bit more row work for zero substitution effort — and it's also how we compute **matrix inverses**."},
        {"b":"check","q":"Gauss-Jordan is also the standard method to find a matrix's…","options":["determinant","transpose","inverse","trace"],"correct":2,"explain":"Augment with the identity and reduce — the right half becomes the inverse."}
      ]
    },
    {
      "tag": "06 · Try your own",
      "title": "🛠 Reduce any matrix fully",
      "blocks": [
        {"b":"p","text":"Use the engine (here or on the **Tools** page) in Reduced (G-J) mode. Enter any system, step through to RREF, and read the solution off the last column. Fractions stay exact."}
      ]
    }
  ],
  "long": [
    {"difficulty":"easy","q":"State the two conditions that make a matrix RREF (beyond being echelon).","steps":["Every pivot (leading entry) equals 1 — a leading 1.","Each pivot is the only non-zero in its column (zeros above and below)."],"answer":"Leading 1s, and each leading 1 is alone in its column."},
    {"difficulty":"easy","q":"Is [1 0 | 4] / [0 1 | -3] in RREF? What does it tell you?","steps":["Leading 1s in each row; zeros elsewhere in each pivot column → yes, RREF.","Row 1: x = 4. Row 2: y = -3."],"answer":"Yes, RREF. x = 4, y = -3."},
    {"difficulty":"medium","q":"Take [1 2 | 5] / [0 1 | 3] (echelon) to RREF and read the answer.","steps":["Pivots are already 1.","Clear above the second pivot: R1 = R1 − 2R2 → [1 0 | -1] / [0 1 | 3].","Read: x = -1, y = 3."],"answer":"x = -1, y = 3."},
    {"difficulty":"medium","q":"Solve by Gauss-Jordan: x + y = 4 ; x - y = 2.","steps":["Augmented: [1 1 | 4] / [1 -1 | 2].","R2 = R2 − R1 → [1 1 | 4] / [0 -2 | -2].","R2 = R2 ÷ (-2) → [1 1 | 4] / [0 1 | 1].","R1 = R1 − R2 → [1 0 | 3] / [0 1 | 1]."],"answer":"x = 3, y = 1."},
    {"difficulty":"hard","q":"Fully reduce to RREF: x + y + z = 6 ; 2y + 5z = -4 ; 2x + 5y - z = 27. Keep fractions.","steps":["Echelon first: R3 = R3 − 2R1 → [0 3 -3 | 15]; R3 = R3 − (3/2)R2 → [0 0 -21/2 | 21].","Scale pivots: R3 ÷ (-21/2) → z-row [0 0 1 | -2]; R2 ÷ 2 → [0 1 5/2 | -2].","Clear above: R2 = R2 − (5/2)R3 → [0 1 0 | 3]; R1 = R1 − R3 then − R2 → [1 0 0 | 5].","Read RREF."],"answer":"x = 5, y = 3, z = -2."},
    {"difficulty":"hard","q":"Use Gauss-Jordan to find the inverse of [[2 1],[1 1]]. Augment with I and reduce.","steps":["[2 1 | 1 0] / [1 1 | 0 1].","R1 ↔ R2 → [1 1 | 0 1] / [2 1 | 1 0].","R2 = R2 − 2R1 → [1 1 | 0 1] / [0 -1 | 1 -2].","R2 = R2 ÷ (-1) → [0 1 | -1 2]; R1 = R1 − R2 → [1 0 | 1 -1].","Right half is the inverse."],"answer":"Inverse = [[1 -1],[-1 2]]."}
  ]
}
]$j$::jsonb
where (title ilike '%Jordan%' or title ilike '%Gauss-Jordan%' or title ilike '%Gauss Jordan%')
  and course_id = (select id from public.courses where title ilike '%Matrix%' limit 1);
