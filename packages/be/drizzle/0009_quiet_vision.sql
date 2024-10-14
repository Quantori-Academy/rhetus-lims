ALTER TABLE "reagents" RENAME COLUMN "enabled" TO "deleted";--> statement-breakpoint
ALTER TABLE "reagents" ALTER COLUMN "deleted" SET DEFAULT false;