import rickandmorty from './rickandmorty';
import { http } from './http';

export const $api = {
	rickandmorty: rickandmorty(http)
};
