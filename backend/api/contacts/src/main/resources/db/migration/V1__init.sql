CREATE TABLE IF NOT EXISTS users
(
    id            uuid PRIMARY KEY,
    first_name    VARCHAR(128),
    last_name     VARCHAR(128),
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
