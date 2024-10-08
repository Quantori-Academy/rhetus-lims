import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

import { getConfig } from '../config/config.js';
import config from '../../../drizzle.config.js';

const { database } = getConfig();

const pool = new pg.Pool({
	connectionString: database.pg.url
});

const db = drizzle(pool);

async function main() {
	if (config.out) {
		await migrate(db, { migrationsFolder: config.out });
		console.log('Migration done!');
	}
}

main()
	.catch(err => {
		console.error(err);
	})
	.finally(async () => {
		await pool.end();
	});
