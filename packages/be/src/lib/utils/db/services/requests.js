import { schema } from '../../../db/schema/index.js';
import { helpers } from '../../common/helpers.js';

const requests = {
	filter: {
		status: {
			property: 'requestStatus',
			schema: 'requests',
			value: string => helpers.lowercase(string),
			operator: 'equal'
		},
		reagentname: {
			property: 'reagentName',
			schema: 'requests',
			operator: 'ilike'
		},
		order: {
			property: 'id',
			schema: 'orders',
			value: string => string,
			operator: 'equal'
		},
		author: {
			property: 'username',
			schema: 'users',
			operator: 'ilike'
		},
		createdat: {
			property: 'createdAt',
			value: string => helpers.toDate(string),
			schema: 'requests',
			operator: 'between'
		},
		updatedat: {
			property: 'updatedAt',
			value: string => helpers.toDate(string),
			schema: 'requests',
			operator: 'between'
		},
		// inner system fields
		deleted: {
			property: 'deleted',
			value: string => string === 'true',
			schema: 'requests',
			operator: 'equal'
		},
		userid: {
			property: 'id',
			value: string => Number(string),
			schema: 'users',
			operator: 'equal'
		}
	},
	sort: {
		reagentname: {
			property: schema.requests.reagentName
		},
		status: {
			property: schema.requests.requestStatus
		},
		quantity: {
			property: schema.requests.quantity
		},
		createdat: {
			property: schema.requests.createdAt
		},
		default: {
			property: schema.requests.createdAt
		}
	}
};

export { requests };
