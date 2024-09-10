import { defineConfig } from 'drizzle-kit';
import { getConfig } from './src/lib/config/config.js';

const config = getConfig();

/** @type { import("drizzle-orm").Config } */
export default defineConfig({
	schema: './src/lib/db/schema/*.js',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: { url: config.database.pg.url },
	verbose: true,
	strict: true
});
