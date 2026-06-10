ALTER TABLE "articles"
  ADD COLUMN IF NOT EXISTS "was_published" boolean NOT NULL DEFAULT false;

UPDATE "articles"
SET "was_published" = true
WHERE "published" = true;
