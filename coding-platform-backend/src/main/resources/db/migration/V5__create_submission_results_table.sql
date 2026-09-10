CREATE TABLE submission_results (

    id BIGSERIAL PRIMARY KEY,

    submission_id BIGINT NOT NULL,

    test_case_id BIGINT NOT NULL,

    status VARCHAR(50) NOT NULL,

    actual_output TEXT,

    execution_time_ms BIGINT,

    memory_used_kb BIGINT,

    error_message TEXT,

    CONSTRAINT fk_submission_result_submission
        FOREIGN KEY (submission_id)
        REFERENCES submissions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_submission_result_test_case
        FOREIGN KEY (test_case_id)
        REFERENCES test_cases(id)
        ON DELETE CASCADE
);