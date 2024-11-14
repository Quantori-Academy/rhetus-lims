import fp from 'fastify-plugin';

async function roleCheckingPlugin(fastify) {
	fastify.decorate('administrator', async (req, reply) => {
		const isAdmin = await fastify.usersService.isAdmin(req.session.user.id);
		if (!isAdmin) {
			return reply.code(403).send({ status: 'error', message: 'Sorry. You have no permissions' });
		}
	});

	fastify.decorate('officer', async (req, reply) => {
		const isOfficer = await fastify.usersService.isOfficer(req.session.user.id);
		if (!isOfficer) {
			return reply.code(403).send({ status: 'error', message: 'Sorry. You have no permissions' });
		}
	});
}

export default fp(roleCheckingPlugin);
