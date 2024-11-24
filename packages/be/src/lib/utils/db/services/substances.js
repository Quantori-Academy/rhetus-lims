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
			property: '"storageId"',
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
		smiles: {
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
			property: '"storageName"'
		},
		expirationdate: {
			property: 'expiration_date'
		},
		relevance: {
			property: 'relevance'
		},
		createdat: {
			property: 'created_at'
		},
		default: {
			property: 'created_at'
		}
	}
};

export { substances };
