import { http } from './http';
import users from './users.js';
import auth from './auth.js';
import storageLocations from './storage-locations.js';
import reagents from './reagents.js';
import substances from './substances.js';
import orders from './orders.js';
import requests from './requests.js';
import notifications from './notifications.js';

export const $api = {
	users: users(http),
	auth: auth(http),
	storages: storageLocations(http),
	reagents: reagents(http),
	substances: substances(http),
	orders: orders(http),
	requests: requests(http),
	notifications: notifications(http)
};
