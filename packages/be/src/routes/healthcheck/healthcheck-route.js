import fp from 'fastify-plugin';

import healthcheckService from '../../services/healthcheck/healthcheck-service.js';
import * as schema from './healthcheck-schema.js';

async function healthcheck(server, options) {
	await server.register(healthcheckService);

	server.route({
		method: 'GET',
		path: options.prefix + 'healthcheck',
		schema: schema.getHealthcheck,
		handler: onGetHealthcheck
	});

	async function onGetHealthcheck(req, reply) {
		try {
			const message = await server.healthcheckService.checkHealth();
			return reply.code(200).send({ status: 'success', message });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}
}

export default fp(healthcheck);
