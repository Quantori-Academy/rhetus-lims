import fp from 'fastify-plugin';
import bcrypt from 'bcrypt';
import * as schema from './auth-schema.js';
import { Status } from '../../lib/db/schema/users.js';

async function auth(server, options) {
	server.route({
		method: 'POST',
		path: options.prefix + 'login',
		schema: schema.login,
		handler: onLogin
	});

	async function onLogin(req, reply) {
		try {
			const { username, password } = req.body;

			const user = await server.usersService.getUserByUsername(username);

			if (!user) {
				return reply.code(400).send({ status: 'success', message: 'User not found.' });
			}

			const shouldUseTempPassword = user.passwordResetStatus === Status.CONFIRMED;
			const isPasswordValid = await bcrypt.compare(
				password,
				shouldUseTempPassword ? user.temporaryPassword : user.password
			);

			if (!isPasswordValid) {
				return reply.code(401).send({
					status: 'error',
					message: 'Invalid password.'
				});
			}

			req.session.user = { id: user.id };

			await server.usersService.updateUser(user.id, { lastLogin: new Date() });

			return reply.code(200).send({
				status: 'success',
				message: shouldUseTempPassword
					? 'Logged in with temporary password. Please reset it.'
					: 'Successfully logged in'
			});
		} catch (err) {
			server.log.error(err);
			return reply
				.code(500)
				.send({ status: 'error', message: 'Oops! Something went wrong. Try again later.' });
		}
	}
}

export default fp(auth);
