import { helpers } from '../../common/helpers.js';

const users = {
	filter: {
		firstname: {
			property: 'firstName',
			schema: 'users',
			operator: 'ilike'
		},
		lastname: {
			property: 'lastName',
			schema: 'users',
			operator: 'ilike'
		},
		username: {
			property: 'username',
			schema: 'users',
			operator: 'ilike'
		},
		email: {
			property: 'email',
			schema: 'users',
			operator: 'ilike'
		},
		lastlogin: {
			property: 'lastLogin',
			value: string => helpers.toDate(string),
			schema: 'users',
			operator: 'between'
		},
		role: {
			property: 'name',
			value: string => helpers.lowercase(string),
			schema: 'roles',
			operator: 'equal'
		},
		// inner system field
		deleted: {
			property: 'deleted',
			value: string => string === 'true',
			schema: 'users',
			operator: 'equal'
		}
	}
};

export { users };
