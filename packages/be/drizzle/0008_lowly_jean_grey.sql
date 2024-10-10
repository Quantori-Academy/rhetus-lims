ALTER TABLE "reagents" RENAME COLUMN "size" TO "quantity";--> statement-breakpoint
ALTER TABLE "reagents" ALTER COLUMN "storage_location_id" DROP NOT NULL;