-- Add required timeline_length column to scenarios as integer
ALTER TABLE "scenarios"
ADD COLUMN IF NOT EXISTS "timeline_length" integer NOT NULL DEFAULT 12;

-- Optional: remove default after backfilling existing rows
ALTER TABLE "scenarios"
ALTER COLUMN "timeline_length" DROP DEFAULT;

