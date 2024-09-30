import fp from 'fastify-plugin';

import * as schema from './roles-schema.js';
import rolesService from '../../services/roles/roles-service.js';
import { http } from '../../lib/utils/index.js';

// TODO: delete after info about user id from request
const USER_ID = 20;

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
				return http.handleError(reply, 403, `Sorry. You have no permissions to view roles`);
			}

			const roles = await server.rolesService.getRoles();

			return http.handleSuccess(reply, 200, `Roles found`, { roles });
		} catch (err) {
			return http.handleError(reply, 500, `Internal Server Error! ${err.message}`);
		}
	}
}

export default fp(roles);
