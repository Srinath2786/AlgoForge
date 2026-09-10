UPDATE submission_results
SET status = 'PASSED'
WHERE status = 'ACCEPTED';

UPDATE submission_results
SET status = 'FAILED'
WHERE status IN ('WRONG_ANSWER', 'COMPILATION_ERROR');
