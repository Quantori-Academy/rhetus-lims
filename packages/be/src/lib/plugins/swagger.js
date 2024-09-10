import fp from 'fastify-plugin';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifySwagger from '@fastify/swagger';

const version = '0.0.1';

async function swaggerGenerator(fastify) {
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
			host: 'localhost', // deploy url
			schemes: ['http', 'https'],
			consumes: ['application/json'],
			produces: ['application/json', 'text/html'],
			securityDefinitions: {
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
