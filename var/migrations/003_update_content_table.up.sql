ALTER TABLE contents
RENAME COLUMN url TO content_path;

ALTER TABLE contents
ALTER COLUMN content_path TYPE TEXT,
ALTER COLUMN content_path DROP NOT NULL;

ALTER TABLE contents
ADD COLUMN presigned_url TEXT;