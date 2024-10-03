import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const requests = pgTable('requests', {
	id: serial('id').primaryKey().notNull(),
	fromUserId: integer('from_user_id').references(() => users.id),
	createdAt: timestamp('created_at').notNull()
});
