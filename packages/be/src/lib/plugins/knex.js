import knex from 'knex';
import fp from 'fastify-plugin';
import config from '../../../knex.config.js';

async function knexPlugin(fastify) {
	const db = knex(config[fastify.config.mode]);

	fastify.decorate('knex', db);

	fastify.addHook('onClose', async (fastifyInstance, done) => {
		await fastifyInstance.knex.destroy();
		done();
	});
}

export default fp(knexPlugin);
