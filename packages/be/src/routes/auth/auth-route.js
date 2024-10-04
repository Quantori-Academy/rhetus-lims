import fp from 'fastify-plugin';
import bcrypt from 'bcrypt';
import * as schema from './auth-schema.js';

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

			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (!isPasswordValid) {
				reply.code(401);
				return { status: 'error', message: 'Invalid credentials.' };
			}

			await server.usersService.updateUser(user.id, { lastLogin: new Date() });

			req.session.user = { id: user.id };

			const message = user.shouldResetPassword
				? 'Your password was reset by an admin, please, change it.'
				: 'Successfully logged in.';

			reply.code(200);
			return { status: 'success', message };
		} catch (err) {
			server.log.error(err);
			reply.code(500);
			return { status: 'error', message: 'Oops! Something went wrong. Try again later.' };
		}
	}

	server.route({
		method: 'POST',
		path: options.prefix + 'reset-password',
		schema: schema.passwordReset,
		handler: onPasswordReset
	});
	async function onPasswordReset(req, reply) {
		try {
			const loggedInUser = req.session.user.id;

			const { username, password } = req.body;
			const isAdmin = await server.usersService.isAdmin(loggedInUser);

			if (isAdmin) {
				const user = await server.usersService.getUserByUsername(username);

				const isOwner = user.id === loggedInUser;
				await server.usersService.updateUser(user.id, { password, shouldResetPassword: !isOwner });

				reply.code(200);
				return { status: 'success', message: `Successfully reset ${username}'s password.` };
			}
			
			await server.usersService.updateUser(loggedInUser, {
				password,
				shouldResetPassword: false
			});

			reply.code(200);
			return { status: 'success', message: `Successfully reset password.` };
		} catch (err) {
			server.log.error(err);
			reply.code(500);
			return { status: 'error', message: 'Oops! Something went wrong. Try again later.' };
		}
	}
}

export default fp(auth);