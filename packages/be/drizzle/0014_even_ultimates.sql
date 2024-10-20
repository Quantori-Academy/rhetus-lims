DO $$ BEGIN
 CREATE TYPE "public"."category" AS ENUM('reagent', 'sample');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "components" (
	"id" uuid,
	"sample_id" uuid,
	"reagent_id" uuid,
	"quantity_used" real NOT NULL,
	"quantity_unit" varchar(256) NOT NULL,
	"category" "category" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "samples" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(256) NOT NULL,
	"quantity_unit" varchar(256) NOT NULL,
	"quantity" real NOT NULL,
	"quantity_left" real NOT NULL,
	"expiration_date" timestamp NOT NULL,
	"storage_id" uuid,
	"description" text DEFAULT '',
	"deleted" boolean DEFAULT false
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "components" ADD CONSTRAINT "components_id_samples_id_fk" FOREIGN KEY ("id") REFERENCES "public"."samples"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "components" ADD CONSTRAINT "components_sample_id_samples_id_fk" FOREIGN KEY ("sample_id") REFERENCES "public"."samples"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "components" ADD CONSTRAINT "components_reagent_id_reagents_id_fk" FOREIGN KEY ("reagent_id") REFERENCES "public"."reagents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "samples" ADD CONSTRAINT "samples_storage_id_storages_id_fk" FOREIGN KEY ("storage_id") REFERENCES "public"."storages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
