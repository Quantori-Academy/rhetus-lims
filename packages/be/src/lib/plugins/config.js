import { getConfig } from '../config/config.js';
import fp from 'fastify-plugin';

async function configPlugin(fastify) {
	const config = getConfig();

	fastify.decorate('config', config);
}

export default fp(configPlugin);
