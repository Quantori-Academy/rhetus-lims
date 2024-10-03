import fp from 'fastify-plugin';

import * as schema from './roles-schema.js';
import rolesService from '../../services/roles/roles-service.js';

async function roles(server, options) {
	await server.register(rolesService);

	server.route({
		method: 'GET',
		path: options.prefix + 'roles',
		preValidation: [server.checkRole],
		schema: schema.getRoles,
		config: { allowedRoles: ['administrator'] },
		handler: onGetRoles
	});
	async function onGetRoles(req, reply) {
		try {
			const roles = await server.rolesService.getRoles();

			return reply.code(200).send({ roles });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}
}

export default fp(roles);
