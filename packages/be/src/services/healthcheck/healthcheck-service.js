import fp from 'fastify-plugin';
import { sql } from 'drizzle-orm';

async function healthcheckService(server) {
	server.decorate('healthcheckService', {
		checkHealth: async () => {
			const checks = await Promise.allSettled([
				server.healthcheckService.checkDbHealth(),
				server.healthcheckService.checkServiceHealth()
			]);

			const result = checks.map(item => item.value).join(' and ');

			return result;
		},

		checkDbHealth: async () => {
			const { rows } = await server.db.execute(sql`select 1`);

			return rows.length > 0 ? 'Db is healthy' : 'Db is unhealthy';
		},

		checkServiceHealth: async () => 'Service is healthy'
	});
}

export default fp(healthcheckService);
