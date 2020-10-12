CREATE TABLE invitations(
  id uuid PRIMARY KEY,
  created_by uuid references users(id),
  email VARCHAR(128),
  sent_at TIMESTAMP,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
