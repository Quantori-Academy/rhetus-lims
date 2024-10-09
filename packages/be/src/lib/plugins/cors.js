import cors from '@fastify/cors';
import { getConfig } from '../config/config.js';

const config = getConfig();

export const autoConfig = {
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	origin: (origin, cb) => {
		const incomingUrl = new URL(origin);
		const allowedUrl = new URL(config.client.url);

		if (incomingUrl.hostname === 'localhost' || incomingUrl.origin === allowedUrl.origin) {
			cb(null, true);
			return;
		}

		cb(new Error('Not allowed'), false);
	},
	credentials: true
};

export default cors;
