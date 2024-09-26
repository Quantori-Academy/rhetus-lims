import fp from 'fastify-plugin';

import * as schema from './roles-schema.js';
import rolesService from '../../services/roles/roles-service.js';

// TODO: delete after info about user id from request
const USER_ID = 16;

async function roles(server, options) {
	await server.register(rolesService);

	server.route({
		method: 'GET',
		path: options.prefix + 'roles',
		// onRequest: [server.auth],
		schema: schema.getRoles,
		handler: onGetRoles
	});
	async function onGetRoles(req, reply) {
		try {
			const isAdmin = await server.usersService.isAdmin(USER_ID);

			if (!isAdmin) {
				reply.code(403);
				return { status: 'error', message: `Sorry. You have no permissions to view roles` };
			}

			const roles = await server.rolesService.getRoles();

			reply.code(200);
			return { roles };
		} catch (err) {
			reply.code(500);
			return { status: 'error', message: `Internal Server Error! ${err.message}` };
		}
	}
}

export default fp(roles);
