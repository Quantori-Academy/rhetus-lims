import { users } from './users.js';
import { substances } from './substances.js';
import { storages } from './storages.js';
import { requests } from './requests.js';
import { orders } from './orders.js';
import { notifications } from './notifications.js';

const servicesMapping = {
	users,
	substances,
	storages,
	requests,
	orders,
	notifications
};

export { servicesMapping };
