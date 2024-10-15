import fp from 'fastify-plugin';
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import { getConfig } from '../config/config.js';

const config = getConfig();

async function sessionPlugin(fastify) {
	await fastify.register(fastifyCookie);
	await fastify.register(fastifySession, {
		secret: config.sessionSecret,
		cookie: {
			secure: 'auto',
			maxAge: 24 * 60 * 60 * 1000
		},
		saveUninitialized: false
	});

	fastify.decorate('authenticate', async (request, reply) => {
		if (!request.session.user) {
			reply.code(401);
			return { status: 'error', message: 'Unauthorized' };
		}
	});
}

export default fp(sessionPlugin);
