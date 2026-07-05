-- ============================================================
-- Quiz questions for Cramer's Rule, Gaussian Elimination, Gauss-Jordan
-- ============================================================
-- HOW TO USE:
-- 1. Go to Supabase → Table Editor → find your quiz questions table
--    (check the actual table name backing `quiz_questions_public` —
--    it's likely called `quiz_questions`; adjust below if different).
-- 2. Confirm the column names match: lesson_id, topic_tag, difficulty,
--    question, options, correct_index, explanation.
-- 3. Replace 'CRAMERS_LESSON_ID', 'GAUSSIAN_LESSON_ID', and
--    'GAUSSJORDAN_LESSON_ID' below with the real lesson UUIDs from
--    your `lessons` table (after you insert those 3 lesson rows).
-- 4. Run this in Supabase SQL Editor.
-- ============================================================

-- ===================== CRAMER'S RULE =====================

insert into quiz_questions (lesson_id, topic_tag, difficulty, question, options, correct_index, explanation) values
('CRAMERS_LESSON_ID', 'cramers-rule', 'easy',
 'For the system 2x + y = 5, x - y = 1, what is D (the determinant of the coefficient matrix)?',
 '["-3", "3", "-1", "1"]', 0,
 'D = (2×-1) - (1×1) = -2 - 1 = -3.'),

('CRAMERS_LESSON_ID', 'cramers-rule', 'easy',
 'In Cramer''s Rule, Dx is formed by replacing which column of A with the constants B?',
 '["The row of coefficients for y", "The column of coefficients for x", "Both columns", "Neither — Dx uses a separate matrix entirely"]', 1,
 'Dx isolates x by swapping in B for the column that held x''s coefficients.'),

('CRAMERS_LESSON_ID', 'cramers-rule', 'medium',
 'If D = 0 and Dx = 0 and Dy = 0, what can you conclude about the system?',
 '["No solution", "Exactly one solution", "Infinitely many solutions", "The system is undefined"]', 2,
 'All-zero determinants mean the equations are dependent (same line/plane) — infinitely many solutions exist.'),

('CRAMERS_LESSON_ID', 'cramers-rule', 'medium',
 'If D = 0 but Dx ≠ 0, what does that tell you?',
 '["Infinitely many solutions", "No solution", "A unique solution still exists", "D must be recalculated"]', 1,
 'A nonzero numerator over a zero denominator (D) means no consistent value of x satisfies the system — no solution.'),

('CRAMERS_LESSON_ID', 'cramers-rule', 'hard',
 'For a 3×3 system, which determinant expansion method is typically used to compute D, Dx, Dy, and Dz?',
 '["Bubble sort", "Cofactor expansion along a row or column", "Binary search", "Gaussian row reduction only"]', 1,
 'Cofactor expansion (using minors) is the standard way to compute 3×3 determinants needed for Cramer''s Rule.'),

('CRAMERS_LESSON_ID', 'cramers-rule', 'hard',
 'Why does Cramer''s Rule become impractical for very large systems (e.g., 50 variables)?',
 '["It only works for 2 variables", "Computing 51 separate large determinants is far more expensive than one elimination pass", "It requires complex numbers", "It cannot handle integer coefficients"]', 1,
 'Determinant computation cost grows factorially with size, making n+1 large determinants vastly more expensive than a single O(n³) elimination.');

-- ===================== GAUSSIAN ELIMINATION =====================

insert into quiz_questions (lesson_id, topic_tag, difficulty, question, options, correct_index, explanation) values
('GAUSSIAN_LESSON_ID', 'gaussian-elimination', 'easy',
 'What is the goal of Gaussian elimination''s forward pass?',
 '["Reduce to the identity matrix", "Reduce to row-echelon form (upper triangular)", "Compute the determinant only", "Find the transpose"]', 1,
 'Gaussian elimination stops at row-echelon form, then uses back-substitution to finish solving.'),

('GAUSSIAN_LESSON_ID', 'gaussian-elimination', 'easy',
 'Which of these is NOT a valid row operation?',
 '["Swap two rows", "Multiply a row by 0", "Multiply a row by a nonzero constant", "Add a multiple of one row to another"]', 1,
 'Multiplying by 0 destroys an equation''s information and is not a valid, reversible row operation.'),

('GAUSSIAN_LESSON_ID', 'gaussian-elimination', 'medium',
 'After reaching row-echelon form, which row should you solve first?',
 '["The first row", "The last row (fewest unknowns)", "Any row — order does not matter", "The row with the largest numbers"]', 1,
 'The last row typically has only one unknown after elimination, making it the natural starting point for back-substitution.'),

('GAUSSIAN_LESSON_ID', 'gaussian-elimination', 'medium',
 'During elimination, a pivot position contains 0. What should you do?',
 '["Divide by 0 anyway", "Swap that row with a row below having a nonzero entry in that column", "Skip that variable entirely", "Restart with different coefficients"]', 1,
 'A zero pivot cannot be used to eliminate other rows — swap with a nonzero row below it first.'),

('GAUSSIAN_LESSON_ID', 'gaussian-elimination', 'hard',
 'While eliminating, an entire row becomes [0, 0, 0 | 0]. What does this mean?',
 '["A calculation error occurred", "That equation was dependent on the others — expect infinitely many solutions", "The system has no solution", "You must add a new equation"]', 1,
 'An all-zero row (including the constant) means it added no new information — it was a linear combination of other rows, leading to infinitely many solutions.'),

('GAUSSIAN_LESSON_ID', 'gaussian-elimination', 'hard',
 'A row becomes [0, 0, 0 | 7]. What does this mean?',
 '["Infinitely many solutions", "A contradiction — the system has no solution", "x = 7", "The pivot must be re-selected"]', 1,
 'This row represents 0 = 7, a false statement, meaning the system is inconsistent and has no solution.');

-- ===================== GAUSS-JORDAN ELIMINATION =====================

insert into quiz_questions (lesson_id, topic_tag, difficulty, question, options, correct_index, explanation) values
('GAUSSJORDAN_LESSON_ID', 'gauss-jordan', 'easy',
 'How does Gauss-Jordan elimination differ from plain Gaussian elimination?',
 '["It only works on 2x2 systems", "It continues eliminating above each pivot until reaching the identity matrix", "It uses determinants instead of row operations", "It cannot solve systems with 3+ variables"]', 1,
 'Gauss-Jordan pushes past row-echelon form to fully reduced row-echelon form (identity matrix), skipping back-substitution.'),

('GAUSSJORDAN_LESSON_ID', 'gauss-jordan', 'easy',
 'In reduced row-echelon form, what value must every pivot equal?',
 '["0", "1", "-1", "Any nonzero number"]', 1,
 'Every pivot in reduced row-echelon form is normalized to exactly 1.'),

('GAUSSJORDAN_LESSON_ID', 'gauss-jordan', 'medium',
 'To find A⁻¹ using Gauss-Jordan, what do you augment A with?',
 '["The zero matrix", "The identity matrix I", "The transpose of A", "The constants matrix B"]', 1,
 '[A | I] is row-reduced until the left side becomes I; the right side then holds A⁻¹.'),

('GAUSSJORDAN_LESSON_ID', 'gauss-jordan', 'medium',
 'What is the main practical trade-off of Gauss-Jordan compared to Gaussian elimination for solving one system?',
 '["It is always faster", "It does more total row operations but avoids back-substitution", "It cannot handle fractions", "It requires a computer, unlike Gaussian elimination"]', 1,
 'Gauss-Jordan eliminates both above and below each pivot — more work overall — but the payoff is reading the answer directly with no back-substitution.'),

('GAUSSJORDAN_LESSON_ID', 'gauss-jordan', 'hard',
 'The pivot position in row 1 is 0, but row 3 has a nonzero entry in that column. What''s the correct first move?',
 '["Divide row 1 by 0", "Swap row 1 and row 3", "Delete row 1", "Add row 2 to row 1"]', 1,
 'You must swap in a row with a nonzero pivot entry before you can normalize and eliminate with it.'),

('GAUSSJORDAN_LESSON_ID', 'gauss-jordan', 'hard',
 'After full reduction, one row reads [0, 0, 0 | 4]. What should you conclude?',
 '["z = 4", "Infinitely many solutions", "No solution — the system is inconsistent", "The matrix needs one more elimination step"]', 2,
 'This row represents 0 = 4, an impossible statement, so the system has no solution regardless of what the other rows say.');
