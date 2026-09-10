ALTER TABLE submissions
    ADD COLUMN IF NOT EXISTS compiler_output TEXT,
    ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP;

UPDATE submissions
SET submitted_at = created_at
WHERE submitted_at IS NULL;
