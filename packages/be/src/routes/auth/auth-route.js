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

			const isPasswordValid = await bcrypt.compare(password, user.password);

			// require a valid password only when the user doesn't have a confirmed reset request
			if (user.passwordResetStatus !== Status.CONFIRMED && !isPasswordValid) {
				return reply.code(401).send({ status: 'error', message: 'Invalid credentials.' });
			}

			let message = 'Successfully logged in.';
			const dataToUpdate = {};

			if (user.passwordResetStatus === Status.CONFIRMED) {
				dataToUpdate.password = password;
				dataToUpdate.passwordResetStatus = Status.NONE;

				message = 'Your password has been reset.';
			}

			await server.usersService.updateUser(user.id, { ...dataToUpdate, lastLogin: new Date() });

			req.session.user = { id: user.id };

			return reply.code(200).send({ status: 'success', message });
		} catch (err) {
			server.log.error(err);
			return reply
				.code(500)
				.send({ status: 'error', message: 'Oops! Something went wrong. Try again later.' });
		}
	}
}

export default fp(auth);
