import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const storages = pgTable('storages', {
	id: serial('id').primaryKey().notNull(),
	room: varchar('room', { length: 300 }).notNull(),
	name: varchar('name', { length: 300 }).notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').notNull()
});