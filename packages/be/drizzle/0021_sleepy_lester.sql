CREATE TABLE IF NOT EXISTS "substances_storage_changes" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" integer,
	"reagent_id" uuid DEFAULT null,
	"sample_id" uuid DEFAULT null,
	"previous_storage_id" uuid NOT NULL,
	"target_storage_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "substances_storage_changes" ADD CONSTRAINT "substances_storage_changes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "substances_storage_changes" ADD CONSTRAINT "substances_storage_changes_reagent_id_reagents_id_fk" FOREIGN KEY ("reagent_id") REFERENCES "public"."reagents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "substances_storage_changes" ADD CONSTRAINT "substances_storage_changes_sample_id_samples_id_fk" FOREIGN KEY ("sample_id") REFERENCES "public"."samples"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "substances_storage_changes" ADD CONSTRAINT "substances_storage_changes_previous_storage_id_storages_id_fk" FOREIGN KEY ("previous_storage_id") REFERENCES "public"."storages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "substances_storage_changes" ADD CONSTRAINT "substances_storage_changes_target_storage_id_storages_id_fk" FOREIGN KEY ("target_storage_id") REFERENCES "public"."storages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
