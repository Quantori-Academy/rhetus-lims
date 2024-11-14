ALTER TYPE "reagent_request_status" ADD VALUE 'completed';--> statement-breakpoint
ALTER TYPE "reagent_request_status" ADD VALUE 'canceled';--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "quantity_unit" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "amount" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requests" ADD CONSTRAINT "requests_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
