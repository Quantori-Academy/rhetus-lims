ALTER TABLE "components" ALTER COLUMN "sample_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "components" ALTER COLUMN "reagent_id" SET DEFAULT null;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "substances_quantity_changes" ADD CONSTRAINT "substances_quantity_changes_sample_id_samples_id_fk" FOREIGN KEY ("sample_id") REFERENCES "public"."samples"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
