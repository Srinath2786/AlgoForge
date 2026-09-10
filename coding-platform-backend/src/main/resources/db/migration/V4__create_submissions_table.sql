CREATE TABLE submissions (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    problem_id BIGINT NOT NULL,

    language VARCHAR(30) NOT NULL,

    source_code TEXT NOT NULL,

    status VARCHAR(50) NOT NULL,

    execution_time_ms BIGINT,

    memory_used_kb BIGINT,

    error_message TEXT,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_submission_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_submission_problem
        FOREIGN KEY (problem_id)
        REFERENCES problems(id)
        ON DELETE CASCADE
);