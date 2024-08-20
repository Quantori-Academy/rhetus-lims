import { getConfig } from './src/lib/config/config.js';

const config = getConfig();

/** @type { Object.<string, import("knex").Knex.Config> } */
export default {
	development: {
		client: 'pg',
		connection: config.database.pg.url,
		migrations: {
			directory: './knex/migrations'
		},
		useNullAsDefault: true
	}
};
