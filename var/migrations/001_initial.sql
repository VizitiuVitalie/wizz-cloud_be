-- +goose Up
-- +goose StatementBegin

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- +goose StatementEnd

-- +goose StatementBegin

CREATE TABLE content (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  size BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_content_user_id ON content(user_id);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE users;

-- +goose StatementEnd

-- +goose StatementBegin

DROP TABLE content;

-- +goose StatementEnd

