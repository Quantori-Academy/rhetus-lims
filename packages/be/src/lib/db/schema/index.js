import { users } from './users.js';
import { roles } from './roles.js';
import { reagents } from './reagents.js';
import { substancesQuantityChanges } from './substances-quantity-changes.js';
import { storages } from './storages.js';
import { samples } from './samples.js';
import { components } from './components.js';
import { substancesStorageChanges } from './substances-storage-changes.js';

export const schema = {
	users,
	roles,
	reagents,
	substancesQuantityChanges,
	storages,
	samples,
	components,
	substancesStorageChanges
};

export const relations = {};
