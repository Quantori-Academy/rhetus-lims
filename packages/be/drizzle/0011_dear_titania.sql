CREATE TABLE IF NOT EXISTS "storages" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"room" varchar(300) NOT NULL,
	"name" varchar(300) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "substances_quantity_changes" ALTER COLUMN "reagent_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "substances_quantity_changes" ALTER COLUMN "sample_id" SET DEFAULT null;