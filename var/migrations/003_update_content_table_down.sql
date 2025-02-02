ALTER TABLE contents
DROP COLUMN presigned_url;

ALTER TABLE contents
ALTER COLUMN content_path TYPE TEXT,
ALTER COLUMN content_path SET NOT NULL;

ALTER TABLE contents
RENAME COLUMN content_path TO url;