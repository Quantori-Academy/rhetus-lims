import { schema } from '../../../db/schema/index.js';

const storages = {
	filter: {
		name: {
			property: 'name',
			schema: 'storages',
			operator: 'ilike'
		},
		room: {
			property: 'room',
			schema: 'storages',
			operator: 'ilike'
		},
		// inner system field
		deleted: {
			property: 'deleted',
			value: string => string === 'true',
			schema: 'storages',
			operator: 'equal'
		}
	},
	sort: {
		creationdate: {
			property: schema.storages.createdAt
		},
		name: {
			property: schema.storages.name
		},
		room: {
			property: schema.storages.room
		},
		default: {
			property: schema.storages.createdAt
		}
	}
};

export { storages };
