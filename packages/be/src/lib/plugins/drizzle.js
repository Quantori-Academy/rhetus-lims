import fp from 'fastify-plugin';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

async function drizzlePlugin(fastify) {
	const client = new pg.Client({ connectionString: fastify.config.database.pg.url });
	await client.connect();
	const db = drizzle(client);

	fastify.decorate('db', db);

	fastify.addHook('onClose', async (fastifyInstance, done) => {
		client.end();
		done();
	});
}

export default fp(drizzlePlugin);
