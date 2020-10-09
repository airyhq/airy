CREATE TABLE users(
  id uuid PRIMARY KEY,
  first_name VARCHAR(128),
  last_name VARCHAR(128),
  avatar_url VARCHAR(512),
  email VARCHAR(128),
  password_hash VARCHAR(128),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
