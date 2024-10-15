import { env } from '../../src/env';

export const api = path => env.api.url + path;
