import { samplesHandlers } from '../samples.js';
import { usersHandlers } from '../users.js';
import { storageLocationHandlers } from '../storage-locations.js';

export const handlers = [...usersHandlers, ...samplesHandlers, ...storageLocationHandlers];
