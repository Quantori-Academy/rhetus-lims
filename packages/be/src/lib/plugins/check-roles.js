import fp from 'fastify-plugin';

async function roleCheckingPlugin(fastify) {
	fastify.decorate('administrator', async (req, reply) => {
		const isAdmin = await fastify.usersService.isRoleByRoleName(
			req.session.user.id,
			'administrator'
		);
		if (!isAdmin) {
			return reply.code(403).send({ status: 'error', message: 'Sorry. You have no permissions' });
		}
	});
}

export default fp(roleCheckingPlugin);
