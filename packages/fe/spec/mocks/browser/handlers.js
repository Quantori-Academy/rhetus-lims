import { samplesHandlers } from '../samples.js';
import { usersHandlers } from '../users.js';
import { storageLocationHandlers } from '../storage-locations.js';
import { reagentsHandlers } from '../reagents.js';
import { authHandlers } from '../auth.js';
import { substancesHandler } from '../substances.js';
import { orderLocationHandlers } from '../orders.js';
import { requestHandlers } from '../requests.js';

export const handlers = [
	...authHandlers,
	...usersHandlers,
	...samplesHandlers,
	...storageLocationHandlers,
	...reagentsHandlers,
	...substancesHandler,
	...orderLocationHandlers,
	...requestHandlers
];
