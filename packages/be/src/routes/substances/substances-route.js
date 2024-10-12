import fp from 'fastify-plugin';

import * as schema from './substances-schema.js';
import substancesService from '../../services/substances/substances-service.js';

async function substances(server, options) {
	await server.register(substancesService);

	server.route({
		method: 'GET',
		path: options.prefix + 'substances',
		preValidation: [server.authenticate],
		schema: schema.getSubstances,
		handler: onGetSubstances
	});

	async function onGetSubstances(req, reply) {
		try {
			const data = await server.substancesService.getSubstances(req.query);

			return reply.code(200).send(data);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}
}

export default fp(substances);
