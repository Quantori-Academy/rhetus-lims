import { pgTable, serial, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const passwordResetRequests = pgTable('password_reset_requests', {
	id: serial('id').primaryKey().notNull(),
	fromUserId: integer('from_user_id').references(() => users.id),
	createdAt: timestamp('created_at').notNull(),
	completed: boolean('completed').default(false),
	completedAt: timestamp('completedAt')
});
