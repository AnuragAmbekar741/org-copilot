ALTER TABLE "financial_items" DROP COLUMN "starts_at";
ALTER TABLE "financial_items" ADD COLUMN "starts_at" integer NOT NULL;

ALTER TABLE "financial_items" DROP COLUMN "ends_at";
ALTER TABLE "financial_items" ADD COLUMN "ends_at" integer NULL;