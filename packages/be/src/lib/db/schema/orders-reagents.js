import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { reagents } from './reagents.js';
import { orders } from './orders.js';

export const ordersReagents = pgTable('orders_reagents', {
	id: uuid('id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	orderId: uuid('order_id').references(() => orders.id),
	reagentId: uuid('reagent_id').references(() => reagents.id)
});
