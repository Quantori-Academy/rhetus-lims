import { samplesHandlers } from '../samples.js';
import { usersHandlers } from '../users.js';

export const handlers = [...usersHandlers, ...samplesHandlers];
