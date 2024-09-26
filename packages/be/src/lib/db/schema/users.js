import { integer, pgTable, serial, timestamp, varchar, text } from 'drizzle-orm/pg-core';

// TODO: add roles schema with relations

export const users = pgTable('users', {
	id: serial('id').primaryKey().notNull(),
	username: varchar('username', { length: 256 }).notNull(),
	password: text('password').notNull(),
	firstName: varchar('first_name', { length: 256 }).notNull(),
	lastName: varchar('last_name', { length: 256 }).notNull(),
	email: varchar('email', { length: 256 }).notNull(),
	roleId: integer('role_id').notNull(),
	lastLogin: timestamp('last_login'),
	createdAt: timestamp('created_at').notNull()
});
