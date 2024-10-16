import { pgTable, varchar, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const storages = pgTable('storages', {
	id: uuid('id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	room: varchar('room', { length: 300 }).notNull(),
	name: varchar('name', { length: 300 }).notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	deleted: boolean('deleted').default(false)
});
