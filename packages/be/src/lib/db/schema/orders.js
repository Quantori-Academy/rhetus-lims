import { pgTable, pgEnum, timestamp, varchar, integer, uuid, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';

export const OrderStatus = {
	PENDING: 'pending',
	ORDERED: 'ordered',
	FULFILLED: 'fulfilled',
	COMPLETED: 'completed',
	CANCELED: 'canceled'
};

export const orderStatusEnum = pgEnum('order_status', Object.values(OrderStatus));

export const orders = pgTable('orders', {
	id: uuid('id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	title: varchar('title', { length: 200 }).notNull(),
	userId: integer('user_id').references(() => users.id),
	seller: varchar('seller', { length: 200 }).default(null),
	orderStatus: orderStatusEnum('order_status').default(OrderStatus.PENDING),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	deleted: boolean('deleted').default(false)
});
