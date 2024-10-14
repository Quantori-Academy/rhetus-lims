CREATE TABLE IF NOT EXISTS "storages" (
	"id" serial PRIMARY KEY NOT NULL,
	"room" varchar(300) NOT NULL,
	"name" varchar(300) NOT NULL,
	"description" text,
	"created_at" timestamp NOT NULL
);
