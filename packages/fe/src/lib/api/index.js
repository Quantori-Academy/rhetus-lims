import { http } from './http';
import users from './users.js';
import auth from './auth.js';
import samples from './samples.js';
import storageLocations from './storage-locations.js';
import reagents from './reagents.js';

export const $api = {
	users: users(http),
	auth: auth(http),
	samples: samples(http),
	storages: storageLocations(http),
	reagents: reagents(http)
};
