-- ============================================================
-- GAUSSIAN ELIMINATION — story lesson. Run in Supabase SQL Editor.
-- Matrix course. Updates the existing Gaussian lesson.
-- ============================================================

update public.lessons
set sections = $j$[
{
  "type": "story",
  "hero": {
    "eyebrow": "Matrix: Basic to Pro · Solving Systems",
    "title": "Gaussian Elimination",
    "sub": "Turn a messy system of equations into a neat staircase, then read the answers straight off. We'll learn exactly what 'echelon form' means, the pivot rules, and reduce a matrix row-by-row with every operation shown."
  },
  "chapters": [
    {
      "tag": "01 · Why",
      "title": "From equations to a staircase",
      "blocks": [
        {"b":"p","text":"Solving three equations by substitution is slow and error-prone. Gaussian elimination is a **mechanical recipe**: rewrite the system as a matrix, use row operations to carve a triangle of zeros, then back-substitute. Same answer, far fewer mistakes."},
        {"b":"eq","text":"x + y + z = 6\n2y + 5z = -4\n2x + 5y - z = 27"},
        {"b":"check","q":"What's the main advantage of elimination over guess-and-substitute?","options":["It looks harder","A fixed, repeatable recipe with fewer mistakes","It avoids all math","It only works for 2 equations"],"correct":1,"explain":"It's a deterministic procedure — follow the steps and the answer falls out."}
      ]
    },
    {
      "tag": "02 · Augmented form",
      "title": "Writing the augmented matrix correctly",
      "blocks": [
        {"b":"p","text":"Strip the letters. Keep only the **coefficients**, and put the right-hand side after a bar. Line up each variable in its own column — a missing variable is a **0**, never a blank."},
        {"b":"eq","text":"[ 1  1   1 | 6 ]\n[ 0  2   5 | -4 ]\n[ 2  5  -1 | 27 ]"},
        {"b":"note","text":"The bar `|` separates coefficients from the constants. The second equation had no x, so its first entry is 0 — write the zero explicitly."},
        {"b":"check","q":"The equation `3y - z = 4` (no x term) becomes which augmented row?","options":["[3 -1 | 4]","[0 3 -1 | 4]","[3 0 -1 | 4]","[4 3 -1 | 0]"],"correct":1,"explain":"No x → leading 0, then 3 for y, -1 for z, and 4 after the bar."}
      ]
    },
    {
      "tag": "03 · What IS echelon form?",
      "title": "The exact conditions",
      "blocks": [
        {"b":"p","text":"A matrix is in **Row Echelon Form (REF)** when ALL of these hold:"},
        {"b":"list","items":[
          "Any all-zero rows sit at the BOTTOM.",
          "The first non-zero entry of each row (its **pivot**, or leading entry) is to the RIGHT of the pivot in the row above it — a staircase stepping right and down.",
          "Everything BELOW each pivot is 0."]},
        {"b":"p","text":"A **pivot** is simply the first non-zero number in a row. As we go down the rows, each pivot must move strictly rightward. If a pivot is ever directly below or to the left of the previous one, it's __not__ echelon yet."},
        {"b":"cards","items":[
          {"label":"✅ Echelon","body":"[1 2 3]\n[0 4 5]\n[0 0 6]","verdict":"pivots step right: col1, col2, col3"},
          {"label":"❌ Not echelon","body":"[1 2 3]\n[0 4 5]\n[0 3 6]","verdict":"row 3 pivot is in col2 — same as row 2, not to the right"}
        ]},
        {"b":"check","q":"Which matrix is in row echelon form?","options":["[1 2 | 3] / [0 5 | 4] / [0 0 | 7]","[1 2 | 3] / [2 5 | 4] / [0 0 | 7]","[0 0 | 3] / [1 2 | 4] / [0 5 | 7]","[1 2 | 3] / [0 5 | 4] / [0 6 | 7]"],"correct":0,"explain":"Only the first has zeros below every pivot AND each pivot stepping strictly right. Option B has a 2 below the first pivot; C has a zero row on top; D has two pivots in the same column."}
      ]
    },
    {
      "tag": "04 · The three row operations",
      "title": "The only moves you're allowed",
      "blocks": [
        {"b":"cards","items":[
          {"label":"Swap","body":"Rᵢ ↔ Rⱼ","verdict":"exchange two rows"},
          {"label":"Scale","body":"Rᵢ = k·Rᵢ (k≠0)","verdict":"multiply a row by a non-zero number"},
          {"label":"Add multiple","body":"Rᵢ = Rᵢ − k·Rⱼ","verdict":"the workhorse — kills entries below a pivot"}
        ]},
        {"b":"p","text":"We write each move on the RIGHT as we do it, e.g. **R2 = R2 − 2R1**. That notation means: the new row 2 equals old row 2 minus twice row 1. These operations never change the solution — they're just re-phrasings of the same equations."},
        {"b":"check","q":"To zero out the `2` in row 3 col 1 when row 1 col 1 is `1`, which operation?","options":["R3 = R3 + 2R1","R3 = R3 − 2R1","R1 = R1 − 2R3","R3 = 2R3"],"correct":1,"explain":"Subtract 2×(row 1) from row 3: the 2 becomes 2 − 2·1 = 0."}
      ]
    },
    {
      "tag": "05 · Watch it reduce",
      "title": "Row-by-row, every operation shown",
      "blocks": [
        {"b":"p","text":"Here's the engine. Press **Reduce step by step**, then **Next step** to advance. Each step DUPLICATES the matrix and writes the operation (like R2 = R2 − 2R1) beside it — so you can compare before/after and copy it into your notes. Keep it on **Echelon** mode for Gaussian."},
        {"b":"interactive","name":"matrix-reducer","props":{"mode":"echelon"},"caption":"Load '3×3 system' and step through. Watch pivots lock in and zeros appear below them. Fractions stay as fractions — no ugly decimals."},
        {"b":"check","q":"In echelon form, what must appear directly BELOW every pivot?","options":["a 1","a 0","the same number","anything"],"correct":1,"explain":"Zeros below every pivot — that's the staircase of zeros."}
      ]
    },
    {
      "tag": "06 · Back-substitution",
      "title": "Reading the answer, no steps skipped",
      "blocks": [
        {"b":"p","text":"Once in echelon form, the bottom row gives one variable directly; substitute upward. Full worked steps for our system (which reduces to a clean triangle):"},
        {"b":"eq","text":"From R3:  z = -2\nFrom R2:  2y + 5(-2) = -4  →  2y = 6  →  y = 3\nFrom R1:  x + 3 + (-2) = 6   →  x = 5"},
        {"b":"note","text":"Exam style: keep every arithmetic step visible and prefer fractions over decimals. Write `y = 6/2 = 3`, not `y = 3.0`."},
        {"b":"check","q":"If a bottom row reads `3z = 9`, then z =","options":["3","6","1/3","27"],"correct":0,"explain":"z = 9/3 = 3."}
      ]
    },
    {
      "tag": "07 · Try your own",
      "title": "🛠 Solve any system yourself",
      "blocks": [
        {"b":"p","text":"Enter your own matrix in the engine above (change rows/cols, type the numbers or fractions). It reduces step-by-step and shows the final solution by back-substitution — perfect for checking homework. The same tool lives on the **Tools** page too."}
      ]
    }
  ],
  "long": [
    {"difficulty":"easy","q":"Write the augmented matrix for: x + 2y = 5 ; 3x - y = 4. Then state its size.","steps":["Coefficients of x, y, then the constant after the bar.","Row 1: [1 2 | 5]. Row 2: [3 -1 | 4].","Size: 2 rows × 3 columns (2×3)."],"answer":"[[1 2 | 5],[3 -1 | 4]], a 2×3 augmented matrix."},
    {"difficulty":"easy","q":"Is this in row echelon form? [1 3 | 2] / [0 0 | 0] / [0 1 | 5]. Explain.","steps":["Rule: all-zero rows go to the BOTTOM.","Here the zero row (row 2) sits ABOVE a non-zero row (row 3).","So it violates echelon form."],"answer":"No — the all-zero row must be at the bottom, and pivots must step right."},
    {"difficulty":"medium","q":"Solve by Gaussian elimination: 2x + y = 5 ; x - y = 1. Show the row operation and back-substitution.","steps":["Augmented: [2 1 | 5] / [1 -1 | 1].","Swap for a nicer pivot: R1 ↔ R2 → [1 -1 | 1] / [2 1 | 5].","R2 = R2 − 2R1 → [1 -1 | 1] / [0 3 | 3].","Back-sub: 3y = 3 → y = 1; x − 1 = 1 → x = 2."],"answer":"x = 2, y = 1."},
    {"difficulty":"medium","q":"Reduce to echelon form and give z: x+y+z=6 ; 2y+5z=-4 ; 2x+5y-z=27.","steps":["Augmented: [1 1 1 | 6] / [0 2 5 | -4] / [2 5 -1 | 27].","R3 = R3 − 2R1 → [1 1 1 | 6] / [0 2 5 | -4] / [0 3 -3 | 15].","R3 = R3 − (3/2)R2 → row 3 becomes [0 0 -21/2 | 21].","Back-sub: -21/2 · z = 21 → z = -2."],"answer":"z = -2 (and continuing gives y = 3, x = 5)."},
    {"difficulty":"hard","q":"Solve fully with Gaussian elimination, keeping fractions: x + 2y + z = 3 ; 2x + 5y - z = -4 ; 3x - 2y - z = 5.","steps":["Augmented: [1 2 1 | 3] / [2 5 -1 | -4] / [3 -2 -1 | 5].","R2 = R2 − 2R1 → [0 1 -3 | -10]. R3 = R3 − 3R1 → [0 -8 -4 | -4].","R3 = R3 + 8R2 → [0 0 -28 | -84].","Back-sub: -28z = -84 → z = 3; y − 3(3) = -10 → y = -1; x + 2(-1) + 3 = 3 → x = 2."],"answer":"x = 2, y = -1, z = 3."},
    {"difficulty":"hard","q":"For which value of k does the system have NO unique solution? x + y = 2 ; 2x + ky = 5. Use elimination.","steps":["Augmented: [1 1 | 2] / [2 k | 5].","R2 = R2 − 2R1 → [0 (k-2) | 1].","If k − 2 = 0 (k = 2), row 2 says 0 = 1 — impossible → no solution.","For any k ≠ 2 there's a unique solution."],"answer":"k = 2 gives no solution (the rows become inconsistent)."}
  ]
}
]$j$::jsonb
where (title ilike '%Gaussian%' or title ilike '%Gauss Elim%')
  and title not ilike '%Jordan%'
  and course_id = (select id from public.courses where title ilike '%Matrix%' limit 1);
