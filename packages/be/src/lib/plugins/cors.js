import cors from '@fastify/cors';

export const autoConfig = {
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	origin: ['http://localhost:5173', 'https://vm3.quantori.academy'],
	credentials: true
};

export default cors;
