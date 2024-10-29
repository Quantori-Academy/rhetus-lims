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
			property: 'created_at'
		}
	}
};

export { storages };
