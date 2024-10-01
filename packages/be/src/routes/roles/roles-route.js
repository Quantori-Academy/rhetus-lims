import fp from 'fastify-plugin';

import * as schema from './roles-schema.js';
import rolesService from '../../services/roles/roles-service.js';
import { http } from '../../lib/utils/index.js';

async function roles(server, options) {
	await server.register(rolesService);

	server.route({
		method: 'GET',
		path: options.prefix + 'roles',
		preValidation: [server.authenticate],
		schema: schema.getRoles,
		handler: onGetRoles
	});
	async function onGetRoles(req, reply) {
		try {
			const authenticatedUserId = req.session.user.id;
			const isAdmin = await server.usersService.isAdmin(authenticatedUserId);

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
