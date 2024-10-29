import fp from 'fastify-plugin';

import * as schema from './password-reset-requests-schema.js';
import { Status } from '../../lib/db/schema/users.js';

async function passwordResetRequests(server, options) {
	server.route({
		method: 'POST',
		path: options.prefix + 'request-password-reset',
		schema: schema.createRequest,
		handler: onRequestPasswordReset
	});

	async function onRequestPasswordReset(req, reply) {
		try {
			const { username } = req.body;
			const user = await server.usersService.getUserByUsername(username);

			if (!user) {
				return reply.code(400).send({ status: 'error', message: `User '${username}' not found.` });
			}

			await server.usersService.updateUser(user.id, { passwordResetStatus: Status.ACTIVE });

			return reply
				.code(201)
				.send({ status: 'success', message: `Password reset request sent for '${username}'.` });
		} catch (err) {
			server.log.error(err);
			return reply
				.code(500)
				.send({ status: 'error', message: 'Oops! Something went wrong. Try again later.' });
		}
	}

	server.route({
		method: 'PATCH',
		path: options.prefix + 'set-temporary-password/:id',
		preValidation: [server.authenticate, server.administrator],
		schema: schema.setTemporaryPassword,
		handler: onSetTemporaryPassword
	});

	async function onSetTemporaryPassword(req, reply) {
		try {
			const userId = req.params.id;
			const user = await server.usersService.getUserById(userId);

			if (!user) {
				return reply.code(400).send({ status: 'error', message: `User not found.` });
			}

			if (user.passwordResetStatus !== Status.ACTIVE) {
				return reply.code(400).send({
					status: 'error',
					message: `User '${user.username}' does not have an active request.`
				});
			}

			const { password } = req.body;

			await server.usersService.updateUser(user.id, {
				passwordResetStatus: Status.CONFIRMED,
				temporaryPassword: password
			});

			return reply.code(200).send({
				status: 'success',
				message: `Temporary password set for ${user.username}.`
			});
		} catch (err) {
			server.log.error(err);
			return reply
				.code(500)
				.send({ status: 'error', message: 'Oops! Something went wrong. Try again later.' });
		}
	}

	server.route({
		method: 'PATCH',
		path: options.prefix + 'reset-password',
		preValidation: [server.authenticate],
		schema: schema.resetPassword,
		handler: onResetPassword
	});

	async function onResetPassword(req, reply) {
		try {
			const userId = req.session.user.id;
			const user = await server.usersService.getUserById(userId);

			if (!user) {
				return reply.code(400).send({ status: 'error', message: `User not found.` });
			}

			const { password } = req.body;

			await server.usersService.updateUser(user.id, {
				password,
				passwordResetStatus: Status.NONE,
				temporaryPassword: null
			});

			return reply.code(200).send({
				status: 'success',
				message: `Password was reset.`
			});
		} catch (err) {
			server.log.error(err);
			return reply
				.code(500)
				.send({ status: 'error', message: 'Oops! Something went wrong. Try again later.' });
		}
	}
}

export default fp(passwordResetRequests);
