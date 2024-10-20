import { samplesHandlers } from '../samples.js';
import { usersHandlers } from '../users.js';
import { storageLocationHandlers } from '../storage-locations.js';
import { reagentsHandlers } from '../reagents.js';
import { authHandlers } from '../auth.js';
import { substancesHandlers } from '../substances.js';

export const handlers = [
	...authHandlers,
	...usersHandlers,
	...samplesHandlers,
	...storageLocationHandlers,
	...reagentsHandlers,
	...substancesHandlers
];
