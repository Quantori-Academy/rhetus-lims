import fp from 'fastify-plugin';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifySwagger from '@fastify/swagger';
import { getConfig } from '../config/config.js';

const version = '0.0.1';

async function swaggerGenerator(fastify) {
	const config = getConfig();

	await fastify.register(fastifySwagger, {
		swagger: {
			info: {
				title: 'Fastify URL Shortener',
				description: 'Fastify URL Shortener documentation',
				version
			},
			externalDocs: {
				url: 'https://github.com/delvedor/fastify-example',
				description: 'Find more info here'
			},
			host: `${config.fastify.host}:${config.fastify.port}`, // deploy url
			schemes: ['http', 'https'],
			consumes: ['application/json'],
			produces: ['application/json', 'text/html'],
			securityDefinitions: {
				Session: {
					type: 'apiKey',
					name: 'Cookie',
					in: 'header'
				},
				Bearer: {
					type: 'apiKey',
					name: 'Bearer',
					in: 'header'
				},
				Csrf: {
					type: 'apiKey',
					name: 'x-csrf-token',
					in: 'header'
				}
			}
		},
		exposeRoute: fastify.config.mode !== 'production'
	});

	await fastify.register(fastifySwaggerUi, {
		routePrefix: '/documentation'
	});
}

export default fp(swaggerGenerator);
