ALTER TABLE submission_results
    DROP CONSTRAINT IF EXISTS submission_results_submission_id_key;

ALTER TABLE submission_results
    ADD CONSTRAINT submission_results_submission_id_test_case_id_key
    UNIQUE (submission_id, test_case_id);
