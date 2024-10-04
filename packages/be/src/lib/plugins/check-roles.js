import fp from 'fastify-plugin';

async function roleCheckingPlugin(fastify) {
	fastify.decorate('administrator', async (req, reply) => {
		const isAdmin = await fastify.usersService.isAdmin(req.session.user.id);
		if (!isAdmin) {
			reply.code(403).send({ status: 'error', message: 'Sorry. You have no permissions' });
		}
	});
}

export default fp(roleCheckingPlugin);
