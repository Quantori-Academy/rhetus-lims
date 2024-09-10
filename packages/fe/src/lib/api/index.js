import cities from './cities.js';
import { http } from './http';

export const $api = {
	cities: cities(http)
};
