import { helpers } from '../../common/helpers.js';

const substances = {
	filter: {
		name: {
			property: 'name',
			schema: 'union',
			operator: 'ilike'
		},
		category: {
			property: 'category',
			schema: 'union',
			operator: 'ilike'
		},
		location: {
			property: 'storage_id',
			value: string => string,
			schema: 'union',
			operator: 'equal'
		},
		expirationdate: {
			property: 'expiration_date',
			value: string => helpers.toDate(string),
			schema: 'union',
			operator: 'between'
		},
		structure: {
			property: 'structure',
			schema: 'union',
			operator: 'structure-search'
		}
	},
	sort: {
		name: {
			property: 'name'
		},
		category: {
			property: 'category'
		},
		location: {
			property: 'storage_id'
		},
		expirationdate: {
			property: 'expiration_date'
		}
	}
};

export { substances };
