import cities from './cities.js';
import { http } from './http';
import users from './users.js';
import auth from './auth.js';
import samples from './samples.js';
import storageLocations from './storage-locations.js';

export const $api = {
	cities: cities(http),
	users: users(http),
	auth: auth(http),
	samples: samples(http),
	storages: storageLocations(http)
};
