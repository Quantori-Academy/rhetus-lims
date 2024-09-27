import fp from 'fastify-plugin';
import bcrypt from 'bcrypt';
import * as schema from './auth-schema.js';

const users = [
	{ username: 'user1', password: await bcrypt.hash('password', 10), id: 1 },
	{ username: 'user2', password: await bcrypt.hash('password', 10), id: 2 }
];

const getUserByUsername = async username => {
	return users.find(x => x.username === username);
};

async function auth(server, options) {
	// await server.register(usersService);

	server.route({
		method: 'POST',
		path: options.prefix + 'login',
		schema: schema.login,
		handler: onLogin
	});
	async function onLogin(req, reply) {
		try {
			const { username, password } = req.body;

			// const user = await server.usersService.getUserByUsername(username);
			const user = await getUserByUsername(username);

			if (!user) {
				reply.code(400);
				return { error: 'User not found.' };
			}

			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (!isPasswordValid) {
				reply.code(401);
				return { error: 'Invalid credentials.' };
			}

			req.session.user = { id: user.id };

			reply.code(200);
			return { message: 'Successfully logged in.' };
		} catch (err) {
			server.log.error(err);
			reply.code(500);
			return { error: 'Oops! Something went wrong. Try again later.' };
		}
	}
}

export default fp(auth);
