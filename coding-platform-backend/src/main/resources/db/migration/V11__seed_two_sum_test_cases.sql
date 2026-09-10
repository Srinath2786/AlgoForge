INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, description, time_limit_ms)
SELECT id,
       '2 7 11 15' || chr(10) || '9' || chr(10),
       '0 1' || chr(10),
       FALSE,
       'Sample input',
       5000
FROM problems
WHERE title = 'Two Sum'
  AND NOT EXISTS (
      SELECT 1 FROM test_cases tc WHERE tc.problem_id = problems.id
  );

INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, description, time_limit_ms)
SELECT id,
       '3 2 4' || chr(10) || '6' || chr(10),
       '1 2' || chr(10),
       TRUE,
       'Hidden validation case',
       5000
FROM problems
WHERE title = 'Two Sum'
  AND NOT EXISTS (
      SELECT 1 FROM test_cases tc WHERE tc.problem_id = problems.id AND tc.is_hidden = TRUE
  );
