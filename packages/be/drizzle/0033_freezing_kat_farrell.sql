ALTER TABLE "orders_items" DROP COLUMN "structure";
ALTER TABLE "orders_items" ADD COLUMN "structure" mol DEFAULT NULL;
ALTER TABLE "requests" DROP COLUMN "structure";
ALTER TABLE "requests" ADD COLUMN "structure" mol DEFAULT NULL;
