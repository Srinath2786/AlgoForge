UPDATE test_cases
SET input = '2 7 11 15' || chr(10) || '9' || chr(10),
    expected_output = '0 1' || chr(10)
WHERE problem_id = (SELECT id FROM problems WHERE title = 'Two Sum' LIMIT 1)
  AND is_hidden = FALSE;

UPDATE test_cases
SET input = '3 2 4' || chr(10) || '6' || chr(10),
    expected_output = '1 2' || chr(10)
WHERE problem_id = (SELECT id FROM problems WHERE title = 'Two Sum' LIMIT 1)
  AND is_hidden = TRUE;
