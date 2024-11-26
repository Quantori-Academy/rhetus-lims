import { pgTable, timestamp, uuid, integer, pgEnum, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';
import { orders } from './orders.js';
import { requests } from './requests.js';

export const Status = {
	PENDING: 'pending',
	ORDERED: 'ordered',
	FULFILLED: 'fulfilled',
	COMPLETED: 'completed',
	CANCELED: 'canceled'
};

export const statusEnum = pgEnum('status', Object.values(Status));

export const statusesHistory = pgTable('status_history', {
	id: uuid('id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	userId: integer('user_id').references(() => users.id),
	orderId: uuid('order_id')
		.references(() => orders.id)
		.default(null),
	requestId: uuid('request_id')
		.references(() => requests.id)
		.default(null),
	status: statusEnum('status').notNull(),
	changeReason: text('change_reason').default(null),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
