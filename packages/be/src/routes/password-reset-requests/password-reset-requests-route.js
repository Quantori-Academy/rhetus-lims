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
			const user = await server.usersService.getUserByUsername(req.body.username);

			if (!user) {
				return reply
					.code(400)
					.send({ status: 'error', message: `User '${req.body.username}' not found.` });
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
		path: options.prefix + 'confirm-password-reset',
		preValidation: [server.authenticate, server.administrator],
		schema: schema.confirmRequest,
		handler: onConfirmRequest
	});

	async function onConfirmRequest(req, reply) {
		try {
			const { username } = req.body;
			const user = await server.usersService.getUserByUsername(req.body.username);

			if (!user) {
				return reply
					.code(400)
					.send({ status: 'error', message: `User '${req.body.username}' not found.` });
			}

			if (user.passwordResetStatus !== Status.ACTIVE) {
				return reply.code(400).send({
					status: 'error',
					message: `User '${req.body.username}' does not have an active request.`
				});
			}

			await server.usersService.updateUser(user.id, { passwordResetStatus: Status.CONFIRMED });

			return reply.code(200).send({
				status: 'success',
				message: `Password reset request confirmed for '${username}'.`
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
