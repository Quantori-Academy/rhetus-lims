DO $$ BEGIN
 CREATE TYPE "public"."order_item_type" AS ENUM('reagent', 'request');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."order_status" AS ENUM('pending', 'ordered', 'fulfilled', 'completed', 'canceled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders_items" (
	"temp_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"order_id" uuid,
	"request_id" uuid DEFAULT null,
	"item_type" "order_item_type" NOT NULL,
	"reagent_name" text NOT NULL,
	"structure" text DEFAULT null,
	"cas_number" varchar(12) DEFAULT null,
	"producer" varchar(256) DEFAULT null,
	"catalog_id" varchar(256) DEFAULT null,
	"catalog_link" text DEFAULT null,
	"unit_price" real DEFAULT null,
	"quantity_unit" varchar(256) NOT NULL,
	"quantity" real NOT NULL,
	"amount" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders_reagents" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"order_id" uuid,
	"reagent_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"title" varchar(200) NOT NULL,
	"user_id" integer,
	"seller" varchar(200) DEFAULT null,
	"order_status" "order_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_reagents" ADD CONSTRAINT "orders_reagents_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_reagents" ADD CONSTRAINT "orders_reagents_reagent_id_reagents_id_fk" FOREIGN KEY ("reagent_id") REFERENCES "public"."reagents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
