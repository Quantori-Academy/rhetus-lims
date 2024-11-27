import { helpers } from '../../common/helpers.js';
import { schema } from '../../../db/schema/index.js';

const notifications = {
	filter: {
		createdat: {
			property: 'createdAt',
			value: string => helpers.toDate(string),
			schema: 'notifications',
			operator: 'between'
		}
	},
	sort: {
		createdat: {
			property: schema.notifications.createdAt
		}
	}
};

export { notifications };
