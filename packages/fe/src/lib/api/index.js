import cities from './cities.js';
import { http } from './http';
import users from './users.js';
import loginUser from './loginUser.js';

export const $api = {
	cities: cities(http),
	users: users(http),
	loginUser: loginUser(http)
};
