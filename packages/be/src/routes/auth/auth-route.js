import fp from 'fastify-plugin';
import bcrypt from 'bcrypt';
import * as schema from './auth-schema.js';
import { Status } from '../../lib/db/schema/users.js';
import authService from '../../services/auth/auth-service.js';

async function auth(server, options) {
	await server.register(authService);

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

			const isPasswordValid = await bcrypt.compare(password, user.password);

			// require a valid password only when the user doesn't have a confirmed reset request
			if (user.passwordResetStatus !== Status.CONFIRMED && !isPasswordValid) {
				reply.code(401);
				return { status: 'error', message: 'Invalid credentials.' };
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

			const { sameSite, secure } = await server.authService.getCookieSettingsByOrigin(
				req.headers.origin
			);

			req.session.cookie.sameSite = sameSite;
			req.session.cookie.secure = secure;

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
