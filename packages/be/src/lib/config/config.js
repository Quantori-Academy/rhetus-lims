import envSchema from 'env-schema';
import S from 'fluent-json-schema';

export function getConfig() {
	const env = envSchema({
		dotenv: true,
		schema: S.object()
			.prop('MODE', S.enum(['development', 'production']).required())
			.prop('PG_DATABASE_URL', S.string().required())
			.prop(
				'LOG_LEVEL',
				S.string()
					.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
					.default('info')
			)
	});

	const config = {
		// prefix: env.API_PREFIX,
		fastify: {
			// host: env.API_HOST,
			// port: env.API_PORT
		},
		database: {
			pg: {
				url: env.PG_DATABASE_URL
			}
		},
		fastifyInit: {
			logger: {
				level: env.LOG_LEVEL
			}
		},
		mode: env.MODE,
		prod: env.MODE === 'production',
		dev: env.MODE === 'development'
	};

	return config;
}
