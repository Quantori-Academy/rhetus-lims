import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const countries = pgTable('countries', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 256 })
});
