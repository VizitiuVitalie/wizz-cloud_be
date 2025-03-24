\c wizzcloud_db

DROP INDEX IF EXISTS idx_contents_user_id;

DROP TABLE IF EXISTS contents;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

DROP DATABASE IF EXISTS wizzcloud_db;