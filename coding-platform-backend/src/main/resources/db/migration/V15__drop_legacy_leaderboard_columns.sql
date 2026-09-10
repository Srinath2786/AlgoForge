ALTER TABLE leaderboard_entries
    DROP COLUMN IF EXISTS username,
    DROP COLUMN IF EXISTS solved_problems;
