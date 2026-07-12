-- ============================================================
-- GAUSSIAN + GAUSS-JORDAN QUIZ BANKS (12 per difficulty each, RANDOM)
-- Run AFTER the two lesson SQL files.
-- ============================================================
do $qz$
declare cid bigint; lid uuid;
begin
  select id into cid from public.courses where title ilike '%Matrix%' limit 1;

  select id into lid from public.lessons where course_id = cid and (title ilike '%Gaussian%') and title not ilike '%Jordan%' limit 1;
  if lid is not null then
    delete from public.quiz_questions where lesson_id = lid;
    insert into public.quiz_questions (id, lesson_id, topic_tag, difficulty, question, options, correct_index, explanation) values
  (gen_random_uuid(), lid, 'gaussian-basics', 'easy', 'Gaussian elimination reduces a matrix to:', '["RREF", "row echelon form", "its inverse", "a diagonal"]'::jsonb, 1, 'REF, then back-substitute.'),
  (gen_random_uuid(), lid, 'gaussian-basics', 'easy', 'The augmented matrix separates coefficients from constants with a:', '["comma", "bar |", "dot", "space"]'::jsonb, 1, 'the bar.'),
  (gen_random_uuid(), lid, 'gaussian-basics', 'easy', 'A missing variable in an equation is written as:', '["blank", "0", "1", "skip"]'::jsonb, 1, 'explicit 0.'),
  (gen_random_uuid(), lid, 'gaussian-basics', 'easy', 'The first non-zero entry of a row is the:', '["pivot", "constant", "determinant", "zero"]'::jsonb, 0, 'pivot/leading entry.'),
  (gen_random_uuid(), lid, 'gaussian-basics', 'easy', 'In echelon form, below each pivot there must be:', '["1s", "0s", "the same value", "anything"]'::jsonb, 1, 'zeros below.'),
  (gen_random_uuid(), lid, 'gaussian-basics', 'easy', 'The three row operations are swap, scale, and:', '["transpose", "add a multiple of another row", "delete", "invert"]'::jsonb, 1, 'add multiple.'),
  (gen_random_uuid(), lid, 'gaussian-basics', 'easy', 'R2 = R2 - 2R1 means new row 2 is:', '["row2 plus 2 row1", "row2 minus twice row1", "2 times row2", "row1 minus row2"]'::jsonb, 1, 'subtract 2R1.'),
  (gen_random_uuid(), lid, 'gaussian-basics', 'easy', 'All-zero rows in echelon form go to the:', '["top", "bottom", "middle", "left"]'::jsonb, 1, 'bottom.'),
  (gen_random_uuid(), lid, 'gaussian-basics', 'easy', 'Row operations change the solution set:', '["always", "never", "sometimes", "randomly"]'::jsonb, 1, 'never — equivalent systems.'),
  (gen_random_uuid(), lid, 'gaussian-basics', 'easy', 'Reading z from a bottom row 4z = 8 gives z =', '["4", "2", "8", "1/2"]'::jsonb, 1, '8/4=2.'),
  (gen_random_uuid(), lid, 'gaussian-basics', 'easy', 'Pivots in echelon form step:', '["left and up", "right and down", "randomly", "stay in place"]'::jsonb, 1, 'staircase right/down.'),
  (gen_random_uuid(), lid, 'gaussian-basics', 'easy', 'After echelon form, we find variables by:', '["guessing", "back-substitution", "inversion", "transpose"]'::jsonb, 1, 'back-sub.'),
  (gen_random_uuid(), lid, 'echelon-form', 'medium', 'Which is row echelon? [1 2|3]/[0 5|4]/[0 0|7] or [1 2|3]/[2 5|4]/[0 0|7]?', '["second", "first", "both", "neither"]'::jsonb, 1, 'first has zeros below pivots.'),
  (gen_random_uuid(), lid, 'echelon-form', 'medium', '[1 3|2]/[0 0|0]/[0 1|5] is echelon?', '["yes", "no - zero row not at bottom", "yes if swapped", "cannot tell"]'::jsonb, 1, 'zero row must be last.'),
  (gen_random_uuid(), lid, 'echelon-form', 'medium', 'To zero the 2 in R3C1 (pivot R1C1=1):', '["R3=R3+2R1", "R3=R3-2R1", "R1=R1-2R3", "R3=2R3"]'::jsonb, 1, 'subtract 2R1.'),
  (gen_random_uuid(), lid, 'echelon-form', 'medium', 'Augmented row for 3y - z = 4 (no x):', '["[3 -1|4]", "[0 3 -1|4]", "[3 0 -1|4]", "[4 3 -1|0]"]'::jsonb, 1, 'leading 0 for x.'),
  (gen_random_uuid(), lid, 'echelon-form', 'medium', 'System 2x+y=5, x-y=1 → after R1<->R2, R2=R2-2R1 row2 is:', '["[0 3|3]", "[0 -3|3]", "[0 1|1]", "[3 0|3]"]'::jsonb, 0, '[0 3|3].'),
  (gen_random_uuid(), lid, 'echelon-form', 'medium', 'A row [0 0 0 | 5] means the system is:', '["consistent", "inconsistent (no solution)", "has infinite solutions", "x=5"]'::jsonb, 1, '0=5 impossible.'),
  (gen_random_uuid(), lid, 'echelon-form', 'medium', 'A row [0 0 0 | 0] means:', '["no solution", "a redundant equation (possible free variable)", "x=0", "error"]'::jsonb, 1, 'redundant.'),
  (gen_random_uuid(), lid, 'echelon-form', 'medium', 'Number of row ops to zero two entries below a pivot:', '["1", "2", "3", "0"]'::jsonb, 1, 'one per entry.'),
  (gen_random_uuid(), lid, 'echelon-form', 'medium', 'Echelon form of [2 4|6]/[1 3|5]: best first move:', '["R1=R1/2 or swap", "delete R2", "multiply R2 by 2", "nothing"]'::jsonb, 0, 'scale or swap for pivot 1.'),
  (gen_random_uuid(), lid, 'echelon-form', 'medium', 'If pivot is 3 and entry below is 6, factor to eliminate:', '["3", "2", "6", "1/2"]'::jsonb, 1, '6/3=2.'),
  (gen_random_uuid(), lid, 'echelon-form', 'medium', 'Back-sub in [1 1 1|6]/[0 2 5|-4]/[0 0 -21/2|21]: z=', '["2", "-2", "21", "-21/2"]'::jsonb, 1, 'z=-2.'),
  (gen_random_uuid(), lid, 'echelon-form', 'medium', 'Elimination works best when the first pivot is:', '["0", "1", "large", "negative"]'::jsonb, 1, '1 simplifies fractions.'),
  (gen_random_uuid(), lid, 'gaussian-advanced', 'hard', 'For x+y=2, 2x+ky=5, no solution when k=', '["0", "1", "2", "5"]'::jsonb, 2, 'k-2=0 makes 0=1.'),
  (gen_random_uuid(), lid, 'gaussian-advanced', 'hard', 'Solving x+2y+z=3,2x+5y-z=-4,3x-2y-z=5 gives x=', '["1", "2", "3", "-2"]'::jsonb, 1, 'x=2.'),
  (gen_random_uuid(), lid, 'gaussian-advanced', 'hard', '...same system, z=', '["1", "2", "3", "-1"]'::jsonb, 2, 'z=3.'),
  (gen_random_uuid(), lid, 'gaussian-advanced', 'hard', 'A 3x4 augmented matrix represents how many equations?', '["4", "3", "12", "2"]'::jsonb, 1, '3 rows=3 eqns.'),
  (gen_random_uuid(), lid, 'gaussian-advanced', 'hard', 'Infinitely many solutions occur when echelon has:', '["a false row", "a zero row (fewer pivots than vars)", "all pivots", "a negative pivot"]'::jsonb, 1, 'free variable.'),
  (gen_random_uuid(), lid, 'gaussian-advanced', 'hard', 'Elimination on [1 1 1|6]/[0 2 5|-4]/[2 5 -1|27]: R3=R3-2R1 gives R3:', '["[0 3 -3|15]", "[0 3 -3|21]", "[0 5 1|15]", "[2 3 -3|15]"]'::jsonb, 0, '[0 3 -3|15].'),
  (gen_random_uuid(), lid, 'gaussian-advanced', 'hard', '...then R3=R3-(3/2)R2 gives R3 as:', '["[0 0 -21/2|21]", "[0 0 -21/2|-21]", "[0 0 21/2|21]", "[0 0 -3|15]"]'::jsonb, 0, '-21/2 z=21.'),
  (gen_random_uuid(), lid, 'gaussian-advanced', 'hard', 'The number of pivots equals the matrix''s:', '["size", "rank", "determinant", "trace"]'::jsonb, 1, 'rank.'),
  (gen_random_uuid(), lid, 'gaussian-advanced', 'hard', 'If rank(A) < rank(augmented), the system is:', '["unique", "inconsistent", "infinite", "empty matrix"]'::jsonb, 1, 'no solution.'),
  (gen_random_uuid(), lid, 'gaussian-advanced', 'hard', 'Partial pivoting swaps to get the pivot with:', '["smallest value", "largest absolute value", "first zero", "last row"]'::jsonb, 1, 'stability.'),
  (gen_random_uuid(), lid, 'gaussian-advanced', 'hard', 'A consistent 3-var system with 2 pivots has:', '["unique solution", "infinitely many solutions", "no solution", "4 solutions"]'::jsonb, 1, 'one free var.'),
  (gen_random_uuid(), lid, 'gaussian-advanced', 'hard', 'Elimination complexity for n equations is about:', '["O(n)", "O(n^2)", "O(n^3)", "O(2^n)"]'::jsonb, 2, '~n^3/3.');
  end if;

  select id into lid from public.lessons where course_id = cid and (title ilike '%Jordan%') limit 1;
  if lid is not null then
    delete from public.quiz_questions where lesson_id = lid;
    insert into public.quiz_questions (id, lesson_id, topic_tag, difficulty, question, options, correct_index, explanation) values
  (gen_random_uuid(), lid, 'gj-basics', 'easy', 'Gauss-Jordan reduces to:', '["REF", "RREF", "inverse only", "diagonal"]'::jsonb, 1, 'RREF.'),
  (gen_random_uuid(), lid, 'gj-basics', 'easy', 'In RREF every pivot equals:', '["0", "1", "2", "its row number"]'::jsonb, 1, 'leading 1.'),
  (gen_random_uuid(), lid, 'gj-basics', 'easy', 'In RREF each pivot column has:', '["all 1s", "only the pivot non-zero", "all 0s", "random"]'::jsonb, 1, 'pivot alone.'),
  (gen_random_uuid(), lid, 'gj-basics', 'easy', 'Gauss-Jordan clears entries:', '["only below pivots", "above AND below pivots", "only above", "none"]'::jsonb, 1, 'both sides.'),
  (gen_random_uuid(), lid, 'gj-basics', 'easy', 'After RREF with identity on left, the last column is:', '["pivots", "the solution", "determinant", "garbage"]'::jsonb, 1, 'solution.'),
  (gen_random_uuid(), lid, 'gj-basics', 'easy', 'Gauss-Jordan needs back-substitution:', '["yes", "no", "sometimes", "always"]'::jsonb, 1, 'no — read directly.'),
  (gen_random_uuid(), lid, 'gj-basics', 'easy', 'A leading 1 is made by:', '["adding rows", "dividing the row by the pivot", "swapping", "multiplying by 0"]'::jsonb, 1, 'scale by 1/pivot.'),
  (gen_random_uuid(), lid, 'gj-basics', 'easy', '[1 0|4]/[0 1|-3] tells us:', '["x=4,y=-3", "x=-3,y=4", "no solution", "x=1"]'::jsonb, 0, 'read directly.'),
  (gen_random_uuid(), lid, 'gj-basics', 'easy', 'Gauss-Jordan is also used to find a matrix:', '["transpose", "inverse", "trace", "minor"]'::jsonb, 1, 'inverse.'),
  (gen_random_uuid(), lid, 'gj-basics', 'easy', 'RREF is unique for a given matrix:', '["false", "true", "sometimes", "only 2x2"]'::jsonb, 1, 'unique.'),
  (gen_random_uuid(), lid, 'gj-basics', 'easy', 'To find an inverse, augment A with:', '["zeros", "the identity I", "its transpose", "ones"]'::jsonb, 1, '[A|I].'),
  (gen_random_uuid(), lid, 'gj-basics', 'easy', '[1 2|5]/[0 1|3] to RREF: R1 =', '["R1-2R2", "R1+2R2", "R1/2", "R2-R1"]'::jsonb, 0, 'clear the 2 above.'),
  (gen_random_uuid(), lid, 'rref-form', 'medium', 'Which is RREF? [1 0|4]/[0 1|7] or [1 3|4]/[0 1|7]?', '["second", "first", "both", "neither"]'::jsonb, 1, 'first clears above.'),
  (gen_random_uuid(), lid, 'rref-form', 'medium', '[2 0|4]/[0 1|7] is RREF?', '["yes", "no - pivot is 2 not 1", "yes if swapped", "cannot tell"]'::jsonb, 1, 'pivot must be 1.'),
  (gen_random_uuid(), lid, 'rref-form', 'medium', 'x+y=4, x-y=2 by G-J: after R2=R2-R1:', '["[0 -2|-2]", "[0 2|2]", "[0 -2|2]", "[2 0|2]"]'::jsonb, 0, '[0 -2|-2].'),
  (gen_random_uuid(), lid, 'rref-form', 'medium', '...then R2/(-2):', '["[0 1|1]", "[0 1|-1]", "[0 -1|1]", "[0 2|1]"]'::jsonb, 0, '[0 1|1].'),
  (gen_random_uuid(), lid, 'rref-form', 'medium', '...then R1=R1-R2 gives R1:', '["[1 0|3]", "[1 0|4]", "[1 1|3]", "[1 0|1]"]'::jsonb, 0, 'x=3.'),
  (gen_random_uuid(), lid, 'rref-form', 'medium', 'Number of leading 1s in the 3x3 identity:', '["1", "2", "3", "0"]'::jsonb, 2, 'three pivots.'),
  (gen_random_uuid(), lid, 'rref-form', 'medium', 'If RREF row is [0 0 0|1], the system is:', '["consistent", "inconsistent", "x=1", "infinite"]'::jsonb, 1, '0=1.'),
  (gen_random_uuid(), lid, 'rref-form', 'medium', 'Cost of G-J vs Gaussian:', '["cheaper", "slightly more row work", "identical", "free"]'::jsonb, 1, 'more work, no back-sub.'),
  (gen_random_uuid(), lid, 'rref-form', 'medium', '[1 1|4]/[0 1|1] to RREF needs:', '["R1=R1-R2", "R2=R2-R1", "R1/2", "nothing"]'::jsonb, 0, 'clear the 1 above.'),
  (gen_random_uuid(), lid, 'rref-form', 'medium', 'A pivot column in RREF looks like a column of the:', '["zero matrix", "identity matrix", "inverse", "transpose"]'::jsonb, 1, 'identity column.'),
  (gen_random_uuid(), lid, 'rref-form', 'medium', 'Finding inverse of [[2 1],[1 1]] gives:', '["[[1 -1],[-1 2]]", "[[1 1],[1 2]]", "[[2 1],[1 1]]", "[[1 0],[0 1]]"]'::jsonb, 0, 'verified.'),
  (gen_random_uuid(), lid, 'rref-form', 'medium', 'The left block becoming I signals:', '["error", "reduction complete", "zero determinant", "a swap needed"]'::jsonb, 1, 'done.'),
  (gen_random_uuid(), lid, 'gj-advanced', 'hard', 'Full RREF of x+y+z=6,2y+5z=-4,2x+5y-z=27: x,y,z =', '["5,3,-2", "3,5,-2", "5,-2,3", "2,3,5"]'::jsonb, 0, 'x=5,y=3,z=-2.'),
  (gen_random_uuid(), lid, 'gj-advanced', 'hard', 'Inverse via G-J augments the matrix with I of the same:', '["value", "size", "rank", "trace"]'::jsonb, 1, 'size.'),
  (gen_random_uuid(), lid, 'gj-advanced', 'hard', 'If A has no inverse, G-J on [A|I] produces:', '["identity", "a zero row on the left", "a solution", "its transpose"]'::jsonb, 1, 'singular → zero row.'),
  (gen_random_uuid(), lid, 'gj-advanced', 'hard', 'RREF with a free variable has a pivot count:', '["equal to variables", "less than variables", "more than variables", "zero"]'::jsonb, 1, 'fewer pivots.'),
  (gen_random_uuid(), lid, 'gj-advanced', 'hard', '[1 2 0|5]/[0 1 0|3]/[0 0 1|-2] — is it RREF?', '["yes", "no - the 2 above pivot 2 remains", "yes if reordered", "only 2 rows"]'::jsonb, 1, 'clear the 2.'),
  (gen_random_uuid(), lid, 'gj-advanced', 'hard', 'To clear that 2: R1 =', '["R1-2R2", "R1+2R2", "R1/2", "R2-2R1"]'::jsonb, 0, 'R1-2R2.'),
  (gen_random_uuid(), lid, 'gj-advanced', 'hard', 'G-J on a 3x3 needing pivots 1: total leading 1s =', '["1", "2", "3", "6"]'::jsonb, 2, 'three.'),
  (gen_random_uuid(), lid, 'gj-advanced', 'hard', 'The RREF of an invertible n x n matrix is:', '["a zero matrix", "the identity", "its inverse", "upper triangular"]'::jsonb, 1, 'identity.'),
  (gen_random_uuid(), lid, 'gj-advanced', 'hard', 'Solving with a 1/2 pivot, exam-style you write:', '["0.5", "1/2", "0,5", "half"]'::jsonb, 1, 'keep the fraction.'),
  (gen_random_uuid(), lid, 'gj-advanced', 'hard', 'G-J to find inverse works only if the matrix is:', '["symmetric", "square and non-singular", "diagonal", "2x2"]'::jsonb, 1, 'square, invertible.'),
  (gen_random_uuid(), lid, 'gj-advanced', 'hard', 'Reduced form clears above pivots working:', '["top-down", "bottom-up", "left-right", "randomly"]'::jsonb, 1, 'upward.'),
  (gen_random_uuid(), lid, 'gj-advanced', 'hard', 'Both Gaussian and G-J give the SAME solution because row ops are:', '["approximations", "reversible/equivalent", "random", "lossy"]'::jsonb, 1, 'equivalent systems.');
  end if;

end
$qz$;
