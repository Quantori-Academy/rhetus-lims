import fp from 'fastify-plugin';

async function roleCheckingPlugin(fastify) {
	fastify.decorate('administrator', async (req, reply) => {
		if (req.session.user.role !== 'administrator') {
			reply.code(403).send({ status: 'error', message: 'Sorry. You have no permissions' });
		}
	});
}

export default fp(roleCheckingPlugin);
