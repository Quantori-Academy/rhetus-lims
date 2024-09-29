import cities from './cities.js';
import { http } from './http';
import users from './users.js';
import resetPassword from './resetPassword.js';

export const $api = {
	cities: cities(http),
	users: users(http),
	resetPassword: resetPassword(http)
};
