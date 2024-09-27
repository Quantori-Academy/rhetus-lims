import fp from 'fastify-plugin';

import * as schema from './users-schema.js';
import usersService from '../../services/users/users-service.js';

// TODO: delete after info about use id from request
const USER_ID = 20;

async function users(server, options) {
	await server.register(usersService);
	// await server.register(usersService);

	server.route({
		method: 'POST',
		path: options.prefix + 'users',
		// onRequest: [server.auth],
		schema: schema.createUser,
		handler: onCreateUser
	});

	async function onCreateUser(req, reply) {
		try {
			const isAdmin = await server.usersService.isAdmin(USER_ID);

			if (!isAdmin) {
				reply.code(403);
				return { status: 'error', message: `Sorry. You have no permissions to add new user` };
			}

			const isUserExist = await server.usersService.getUserByUsername(req.body.username);

			if (isUserExist) {
				reply.code(409);
				return { status: 'error', message: `Sorry. User '${req.body.username}' already exists` };
			}

			const isRoleExist = await server.rolesService.getRoleById(req.body.roleId);

			if (!isRoleExist) {
				reply.code(409);
				return { status: 'error', message: 'No such role' };
			}

			const username = await server.usersService.createUser(req.body);
			if (!username) {
				throw new Error('Sorry. User was not created');
			}

			reply.code(201);
			return { status: 'success', message: `User '${username}' was created` };
		} catch (err) {
			reply.code(500);
			return { status: 'error', message: `Internal Server Error! ${err.message}` };
		}
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'users/:id',
		// onRequest: [server.auth],
		schema: schema.getUser,
		handler: onGetUser
	});
	async function onGetUser(req, reply) {
		try {
			const isAdmin = await server.usersService.isAdmin(USER_ID);

			if (!isAdmin && USER_ID !== Number(req.params.id)) {
				reply.code(403);
				return { status: 'error', message: `Sorry. You have no permissions to view this user` };
			}

			const user = await server.usersService.getUserById(Number(req.params.id));

			if (!user) {
				reply.code(404);
				return { status: 'error', message: `No such user` };
			}

			const {
				users: { id, username, firstName, lastName, email, createdAt },
				roles: { id: rolesId, name }
			} = user;

			reply.code(200);
			return {
				id,
				username,
				firstName,
				lastName,
				email,
				role: {
					id: rolesId,
					name
				},
				createdAt
			};
		} catch (err) {
			reply.code(500);
			return { status: 'error', message: `Internal Server Error! ${err.message}` };
		}
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'users',
		// onRequest: [server.auth],
		schema: schema.getUsers,
		handler: onGetUsers
	});
	async function onGetUsers(req, reply) {
		try {
			const isAdmin = await server.usersService.isAdmin(USER_ID);

			if (!isAdmin) {
				reply.code(403);
				return { status: 'error', message: `Sorry. You have no permissions to view users` };
			}

			const data = await server.usersService.getUsers(req.query);

			reply.code(200);
			return data;
		} catch (err) {
			reply.code(500);
			return { status: 'error', message: `Internal Server Error! ${err.message}` };
		}
	}

	server.route({
		method: 'PATCH',
		path: options.prefix + 'users/:id',
		// onRequest: [server.auth],
		schema: schema.updateUser,
		handler: onUpdateUser
	});
	async function onUpdateUser(req, reply) {
		try {
			const isAdmin = await server.usersService.isAdmin(USER_ID);

			// username will be cut by validation, but it is more safer
			if ('username' in req.body) {
				reply.code(403);
				return { status: 'error', message: `Sorry. Username cannot be changed` };
			}

			if (!isAdmin && USER_ID !== Number(req.params.id)) {
				reply.code(403);
				return { status: 'error', message: `Sorry. You have no permissions to change this user` };
			}

			if ('roleId' in req.body) {
				if (!isAdmin) {
					reply.code(403);
					return { status: 'error', message: `Sorry. You have no permissions to change role` };
				}

				const targetRole = await server.rolesService.getRoleById(req.body.roleId);

				if (!targetRole) {
					reply.code(404);
					return { status: 'error', message: `No such role` };
				}

				// Admin updating himself
				if (Number(req.params.id) === USER_ID) {
					const isRoleDowngrading = targetRole.name !== 'administrator';
					const isLastAdmin = await server.usersService.isLastAdmin(Number(req.params.id));

					if (isRoleDowngrading && isLastAdmin) {
						reply.code(409);
						return {
							status: 'error',
							message: `Sorry. You cannot update your role. You are the only system administrator.`
						};
					}
				}
			}

			const user = await server.usersService.getUserById(Number(req.params.id));

			if (!user) {
				reply.code(404);
				return { status: 'error', message: `No such user` };
			}

			const username = await server.usersService.updateUser(Number(req.params.id), req.body);

			reply.code(200);
			return { status: 'success', message: `User '${username}' was updated` };
		} catch (err) {
			reply.code(500);
			return { status: 'error', message: `Internal Server Error! ${err.message}` };
		}
	}

	server.route({
		method: 'DELETE',
		path: options.prefix + 'users/:id',
		// onRequest: [server.auth],
		schema: schema.deleteUser,
		handler: onDeleteUser
	});
	async function onDeleteUser(req, reply) {
		try {
			const isAdmin = await server.usersService.isAdmin(USER_ID);

			if (!isAdmin) {
				reply.code(403);
				return { status: 'error', message: `Sorry. You have no permissions to delete user` };
			}

			const user = await server.usersService.getUserById(Number(req.params.id));

			if (!user) {
				reply.code(404);
				return { status: 'error', message: `No such user` };
			}

			// Admin deleting himself
			if (Number(req.params.id) === USER_ID) {
				const isLastAdmin = await server.usersService.isLastAdmin(Number(req.params.id));

				if (isLastAdmin) {
					reply.code(409);
					return {
						status: 'error',
						message: `Sorry. You cannot delete your profile. You are the only system administrator.`
					};
				}
			}

			const username = await server.usersService.deleteUser(Number(req.params.id));

			if (!username) {
				throw new Error('Sorry. User was not deleted');
			}

			reply.code(200);
			return { status: 'success', message: `User '${username}' was deleted` };
		} catch (err) {
			reply.code(500);
			return { status: 'error', message: `Internal Server Error! ${err.message}` };
		}
	}
}

export default fp(users);
