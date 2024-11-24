import { helpers } from '../../common/helpers.js';
import { schema } from '../../../db/schema/index.js';

const orders = {
	filter: {
		createdat: {
			property: 'createdAt',
			value: string => helpers.toDate(string),
			schema: 'orders',
			operator: 'between'
		},
		updatedat: {
			property: 'updatedAt',
			value: string => helpers.toDate(string),
			schema: 'orders',
			operator: 'between'
		},
		seller: {
			property: 'seller',
			schema: 'orders',
			operator: 'ilike'
		},
		title: {
			property: 'title',
			schema: 'orders',
			operator: 'ilike'
		},
		status: {
			property: 'orderStatus',
			value: string => helpers.lowercase(string),
			schema: 'orders',
			operator: 'equal'
		},
		author: {
			property: 'username',
			schema: 'users',
			operator: 'ilike'
		},
		// inner system field
		deleted: {
			property: 'deleted',
			value: string => string === 'true',
			schema: 'orders',
			operator: 'equal'
		}
	},
	sort: {
		createdat: {
			property: schema.orders.createdAt
		},
		updatedat: {
			property: schema.orders.updatedAt
		},
		seller: {
			property: schema.orders.seller
		},
		title: {
			property: schema.orders.title
		},
		status: {
			property: schema.orders.orderStatus
		},
		default: {
			property: schema.orders.createdAt
		}
	}
};

export { orders };
