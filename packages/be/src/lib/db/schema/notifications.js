import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.js';
import { requests } from './requests.js';

export const notifications = pgTable('notifications', {
	id: uuid('id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	orderId: uuid('order_id')
		.references(() => orders.id)
		.default(null),
	requestId: uuid('request_id')
		.references(() => requests.id)
		.default(null),
	message: text('message').default(''),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
