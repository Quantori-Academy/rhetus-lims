import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { env } from '../../../src/env';

export const worker = setupWorker(...handlers);

export const startWorker = () => {
	if (env.dev) {
		worker.start({
			onUnhandledRequest: 'bypass'
		});
	}
};
