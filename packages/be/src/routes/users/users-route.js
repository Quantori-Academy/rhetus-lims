import fp from 'fastify-plugin';

import * as schema from './users-schema.js';
import usersService from '../../services/users/users-service.js';
import { http } from '../../lib/utils/index.js';

// TODO: delete after info about use id from request
const USER_ID = 1;

async function users(server, options) {
	await server.register(usersService);

	server.route({
		method: 'POST',
		path: options.prefix + 'users',
		// onRequest: [server.auth],
		schema: schema.createUser,
		handler: onCreateUser
	});

	server.route({
		method: 'GET',
		path: options.prefix + 'users/:id',
		// onRequest: [server.auth],
		schema: schema.getUser,
		handler: onGetUser
	});

	server.route({
		method: 'GET',
		path: options.prefix + 'users',
		// onRequest: [server.auth],
		schema: schema.getUsers,
		handler: onGetUsers
	});

	server.route({
		method: 'PATCH',
		path: options.prefix + 'users/:id',
		// onRequest: [server.auth],
		schema: schema.updateUser,
		handler: onUpdateUser
	});

	server.route({
		method: 'DELETE',
		path: options.prefix + 'users/:id',
		// onRequest: [server.auth],
		schema: schema.deleteUser,
		handler: onDeleteUser
	});

	async function onCreateUser(req, reply) {
		try {
			const isAdmin = await server.usersService.isAdmin(USER_ID);

			if (!isAdmin) {
				return http.handleError(reply, 403, `Sorry. You have no permissions to add new user`);
			}

			const isUserExist = await server.usersService.getUserByUsername(req.body.username);

			if (isUserExist) {
				return http.handleError(reply, 409, `Sorry. User '${req.body.username}' already exists`);
			}

			const isRoleExist = await server.rolesService.getRoleById(req.body.roleId);

			if (!isRoleExist) {
				return http.handleError(reply, 409, `No such role`);
			}

			const username = await server.usersService.createUser(req.body);

			return http.handleSuccess(reply, 201, `User '${username}' was created`);
		} catch (err) {
			return http.handleError(reply, 500, `Internal Server Error! ${err.message}`);
		}
	}

	async function onGetUser(req, reply) {
		try {
			const isAdmin = await server.usersService.isAdmin(USER_ID);
			const userId = Number(req.params.id);
			const isOwner = USER_ID === userId;

			if (!isAdmin && !isOwner) {
				return http.handleError(reply, 403, `Sorry. You have no permissions to view this user`);
			}

			const user = await server.usersService.getUserById(userId);

			if (!user) {
				return http.handleError(reply, 404, `No such user`);
			}

			return http.handleSuccess(reply, 200, `User found`, user);
		} catch (err) {
			return http.handleError(reply, 500, `Internal Server Error! ${err.message}`);
		}
	}

	async function onGetUsers(req, reply) {
		try {
			const isAdmin = await server.usersService.isAdmin(USER_ID);

			if (!isAdmin) {
				return http.handleError(reply, 403, `Sorry. You have no permissions to view users`);
			}

			const data = await server.usersService.getUsers(req.query);

			return http.handleSuccess(reply, 200, `Users found`, data);
		} catch (err) {
			return http.handleError(reply, 500, `Internal Server Error! ${err.message}`);
		}
	}

	async function onUpdateUser(req, reply) {
		try {
			const isAdmin = await server.usersService.isAdmin(USER_ID);
			const userId = Number(req.params.id);
			const isOwner = USER_ID === userId;

			if (!isAdmin && !isOwner) {
				return http.handleError(reply, 403, `Sorry. You have no permissions to change this user`);
			}

			const user = await server.usersService.getUserById(userId);

			if (!user) {
				return http.handleError(reply, 404, `No such user`);
			}

			if ('roleId' in req.body) {
				return await handleUserUpdateWithRole(reply, userId, req.body, { isOwner, isAdmin });
			}

			return await handleUserUpdateWithoutRole(reply, userId, req.body);
		} catch (err) {
			return http.handleError(reply, 500, `Internal Server Error! ${err.message}`);
		}
	}

	async function onDeleteUser(req, reply) {
		try {
			const isAdmin = await server.usersService.isAdmin(USER_ID);
			const userId = Number(req.params.id);
			const isOwner = USER_ID === userId;

			if (!isAdmin) {
				return http.handleError(reply, 403, `Sorry. You have no permissions to delete user`);
			}

			const user = await server.usersService.getUserById(userId);

			if (!user) {
				return http.handleError(reply, 404, `No such user`);
			}

			const isLastAdmin = await server.usersService.isLastAdmin(userId);

			// Admin deleting himself
			if (isOwner && isLastAdmin) {
				return http.handleError(
					reply,
					409,
					`Sorry. You cannot delete your profile. You are the only system administrator.`
				);
			}

			const username = await server.usersService.deleteUser(userId);

			return http.handleSuccess(reply, 200, `User '${username}' was deleted`);
		} catch (err) {
			return http.handleError(reply, 500, `Internal Server Error! ${err.message}`);
		}
	}

	async function handleUserUpdateWithRole(reply, userId, data, permissions) {
		const { isOwner, isAdmin } = permissions;

		if (!isAdmin) {
			return http.handleError(reply, 403, `Sorry. You have no permissions to change role`);
		}
		const targetRole = await server.rolesService.getRoleById(data.roleId);

		if (!targetRole) {
			return http.handleError(reply, 404, `No such role`);
		}

		const isRoleDowngrading = targetRole.name !== 'administrator';
		const isLastAdmin = await server.usersService.isLastAdmin(userId);

		if (isOwner && isRoleDowngrading && isLastAdmin) {
			return http.handleError(
				reply,
				409,
				`Sorry. You cannot update your role. You are the only system administrator.`
			);
		}

		const username = await server.usersService.updateUser(userId, data);

		return http.handleSuccess(reply, 200, `User '${username}' was updated`);
	}

	async function handleUserUpdateWithoutRole(reply, userId, data) {
		const username = await server.usersService.updateUser(userId, data);

		return http.handleSuccess(reply, 200, `User '${username}' was updated`);
	}
}

export default fp(users);
