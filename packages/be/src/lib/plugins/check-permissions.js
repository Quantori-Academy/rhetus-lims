import fp from 'fastify-plugin';

async function roleChecking(fastify) {
	fastify.decorate('checkRole', async (request, reply) => {
		const {
			session: { user },
			routeOptions: { config }
		} = request;

		if (!config.allowedRoles.includes(user.role)) {
			reply.code(403).send({ status: 'error', message: 'Sorry. You have no permissions' });
		}
	});
}

export default fp(roleChecking);
