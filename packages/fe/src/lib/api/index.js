import cities from './cities.js';
import { http } from './http';
import users from './users.js';
import auth from './reset-password.js';

export const $api = {
	cities: cities(http),
	users: users(http),
	auth: auth(http)
};
