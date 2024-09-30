import cors from '@fastify/cors';

export const autoConfig = {
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
};

export default cors;
