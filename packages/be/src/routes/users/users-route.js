import fp from 'fastify-plugin';

import * as schema from './users-schema.js';
import usersService from '../../services/users/users-service.js';

async function users(server, options) {
	await server.register(usersService);

	server.route({
		method: 'POST',
		path: options.prefix + 'users',
		preValidation: [server.authenticate, server.administrator],
		schema: schema.createUser,
		handler: onCreateUser
	});

	async function onCreateUser(req, reply) {
		try {
			const isUserExist = await server.usersService.getUserByUsername(req.body.username);

			if (isUserExist) {
				reply
					.code(409)
					.send({ status: 'error', message: `Sorry. User '${req.body.username}' already exists` });
			}

			const isRoleExist = await server.rolesService.getRoleById(req.body.roleId);

			if (!isRoleExist) {
				return reply.code(409).send({ status: 'error', message: `No such role` });
			}

			const username = await server.usersService.createUser(req.body);

			return reply.code(201).send({ status: 'success', message: `User '${username}' was created` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'users/:id',
		preValidation: [server.authenticate],
		schema: schema.getUser,
		handler: onGetUser
	});

	async function onGetUser(req, reply) {
		try {
			const authenticatedUserId = req.session.user.id;
			const isAdmin = await server.usersService.isAdmin(authenticatedUserId);
			const userId = Number(req.params.id);
			const isOwner = authenticatedUserId === userId;

			if (!isAdmin && !isOwner) {
				reply
					.code(403)
					.send({ status: 'error', message: `Sorry. You have no permissions to view this user` });
			}

			const user = await server.usersService.getUserById(userId);

			if (!user) {
				return reply.code(404).send({ status: 'error', message: `No such user` });
			}

			return reply.code(200).send(user);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'users',
		preValidation: [server.authenticate, server.administrator],
		schema: schema.getUsers,
		handler: onGetUsers
	});

	async function onGetUsers(req, reply) {
		try {
			const data = await server.usersService.getUsers(req.query);

			return reply.code(200).send(data);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'PATCH',
		path: options.prefix + 'users/:id',
		preValidation: [server.authenticate],
		schema: schema.updateUser,
		handler: onUpdateUser
	});

	async function onUpdateUser(req, reply) {
		try {
			const authenticatedUserId = req.session.user.id;
			const isAdmin = await server.usersService.isAdmin(authenticatedUserId);
			const userId = Number(req.params.id);
			const isOwner = authenticatedUserId === userId;

			if (!isAdmin && !isOwner) {
				reply
					.code(403)
					.send({ status: 'error', message: `Sorry. You have no permissions to change this user` });
			}

			const user = await server.usersService.getUserById(userId);

			if (!user) {
				return reply.code(404).send({ status: 'error', message: `No such user` });
			}

			if ('roleId' in req.body) {
				const { code, status, message } = await server.usersService.handleUserUpdateWithRole(
					userId,
					req.body,
					{ isOwner, isAdmin }
				);
				return reply.code(code).send({ status, message });
			}

			const username = await server.usersService.updateUser(userId, req.body);

			return reply.code(200).send({ status: 'success', message: `User '${username}' was updated` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'DELETE',
		path: options.prefix + 'users/:id',
		preValidation: [server.authenticate, server.administrator],
		schema: schema.deleteUser,
		handler: onDeleteUser
	});

	async function onDeleteUser(req, reply) {
		try {
			const authenticatedUserId = req.session.user.id;
			const userId = Number(req.params.id);
			const isOwner = authenticatedUserId === userId;

			const user = await server.usersService.getUserById(userId);

			if (!user) {
				return reply.code(404).send({ status: 'error', message: `No such user` });
			}

			const isLastAdmin = await server.usersService.isLastAdmin(userId);

			// Admin deleting himself
			if (isOwner && isLastAdmin) {
				return reply.code(409).send({
					status: 'error',
					message: `Sorry. You cannot delete your profile. You are the only system administrator.`
				});
			}

			const username = await server.usersService.deleteUser(userId);

			return reply.code(200).send({ status: 'success', message: `User '${username}' was deleted` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}
}

export default fp(users);
