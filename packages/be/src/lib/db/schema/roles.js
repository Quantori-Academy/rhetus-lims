import { pgTable, serial, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('name', ['administrator', 'procurement officer', 'researcher']);

export const roles = pgTable('roles', {
	id: serial('id').primaryKey().notNull(),
	name: roleEnum('name')
});
