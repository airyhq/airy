CREATE TABLE users(
  id uuid PRIMARY KEY,
  first_name VARCHAR(128),
  last_name VARCHAR(128),
  email VARCHAR(128) UNIQUE,
  password_hash VARCHAR(128),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
