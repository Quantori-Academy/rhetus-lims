import { build } from './app.js';
import closeWithGrace from 'close-with-grace';
import { getConfig } from './lib/config/config.js';

const config = getConfig();
const opts = config.fastifyInit;

// We want to use pino-pretty only if there is a human watching this,
// otherwise we log as newline-delimited JSON.
if (process.stdout.isTTY) {
	opts.logger.transport = { target: 'pino-pretty' };
}

const port = config.fastify.port || 3000;
const host = config.fastify.host || '127.0.0.1';

const app = await build(opts);
console.log(app.printRoutes());
await app.listen({ port, host });

closeWithGrace(async ({ err }) => {
	if (err) {
		app.log.error({ err }, 'server closing due to error');
	}
	app.log.info('shutting down gracefully');
	await app.close();
});
