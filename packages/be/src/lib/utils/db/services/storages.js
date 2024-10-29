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
		}
	},
	sort: {
		creationdate: {
			property: 'created_at'
		}
	}
};

export { storages };
