import { ofetch } from 'ofetch';
import { env } from '../../env';

export const http = ofetch.create({ baseURL: env.api.url });
