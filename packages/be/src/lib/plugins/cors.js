import cors from '@fastify/cors';
import { getConfig } from '../config/config.js';
const config = getConfig();

export const autoConfig = {
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	origin: ['http://localhost:5173', 'https://vm3.quantori.academy', config.client.url],
	credentials: true
};

export default cors;
