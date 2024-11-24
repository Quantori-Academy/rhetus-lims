import { users } from './users.js';
import { roles } from './roles.js';
import { reagents } from './reagents.js';
import { substancesQuantityChanges } from './substances-quantity-changes.js';
import { storages } from './storages.js';
import { samples } from './samples.js';
import { components } from './components.js';
import { substancesStorageChanges } from './substances-storage-changes.js';
import { requests } from './requests.js';
import { orders } from './orders.js';
import { ordersReagents } from './orders-reagents.js';
import { ordersItems } from './orders-items.js';
import { substancesHistory } from './substances-history.js';

export const schema = {
	users,
	roles,
	reagents,
	substancesQuantityChanges,
	storages,
	samples,
	components,
	substancesStorageChanges,
	requests,
	orders,
	ordersReagents,
	ordersItems,
	substancesHistory
};

export const relations = {};
