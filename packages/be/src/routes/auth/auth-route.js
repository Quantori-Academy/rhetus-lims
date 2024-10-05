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
				reply.code(400);
				return { status: 'success', message: 'User not found.' };
			}

			let message = 'Successfully logged in.';

			if (user.shouldResetPassword) {
				await server.usersService.updateUser(user.id, {
					password,
					passwordResetStatus: Status.NONE
				});
				message = 'Your password has been reset.';
			} else {
				const isPasswordValid = await bcrypt.compare(password, user.password);

				// eslint-disable-next-line max-depth
				if (!isPasswordValid) {
					reply.code(401);
					return { status: 'error', message: 'Invalid credentials.' };
				}
			}

			await server.usersService.updateUser(user.id, { lastLogin: new Date() });

			req.session.user = { id: user.id };

			reply.code(200);
			return { status: 'success', message };
		} catch (err) {
			server.log.error(err);
			reply.code(500);
			return { status: 'error', message: 'Oops! Something went wrong. Try again later.' };
		}
	}
}

export default fp(auth);
