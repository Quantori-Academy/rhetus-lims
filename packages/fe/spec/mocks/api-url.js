import { env } from '../../src/env';

export const api = path => new URL(path, env.api.url).toString();
