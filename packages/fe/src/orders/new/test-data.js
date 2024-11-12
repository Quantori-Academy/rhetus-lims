export const requestInfo = {
	requests: [
		{
			id: '22a5974b-cb37-4ebd-9060-8cc131945517',
			author: {
				id: 1,
				username: 'username3'
			},
			reagentName: 'good acid',
			quantityUnit: 'l, bottle',
			quantity: 2,
			amount: 1,
			status: 'pending',
			userComment: 'we need it asap',
			poComment: 'we have no enough money',
			createdAt: '2024-09-27T13:16:35.744Z',
			updatedAt: '2024-09-28T13:16:35.744Z',
			structure: 'H2SO4',
			casNumber: '1111111-11-1',
			orderId: '22a5974b-cb37-4ebd-9060-8cc131945517'
		},
		{
			id: '22a5974b-cb37-4ebd-9060-8cc131943344',
			author: {
				id: 1,
				username: 'username3'
			},
			reagentName: 'better acid',
			quantityUnit: 'l, bottle',
			quantity: 2,
			amount: 1,
			status: 'ordered',
			userComment: 'we need it asap',
			poComment: "let's do it",
			createdAt: '2024-09-27T13:16:35.744Z',
			updatedAt: '2024-10-10T00:00:00.000Z',
			structure: 'H2SO4',
			casNumber: '2222222-22-2',
			orderId: '22a5974b-cb37-4ebd-9060-8cc131945517'
		},
		{
			id: '22a5974b-cb37-4ebd-9060-8cc131931274',
			author: {
				id: 1,
				username: 'username3'
			},
			reagentName: 'Water',
			quantityUnit: 'l, bottle',
			quantity: 2,
			amount: 1,
			status: 'canceled',
			userComment: 'we need it asap',
			poComment: "let's do it",
			createdAt: '2024-09-30T13:16:35.744Z',
			updatedAt: '2025-10-15T00:00:00.000Z',
			structure: 'H2SO4',
			casNumber: '2222222-22-2',
			orderId: '22a5974b-cb37-4ebd-9060-8cc131945517'
		},
		{
			id: '22a5974b-cb37-4ebd-9060-8cc131933333',
			author: {
				id: 1,
				username: 'username3'
			},
			reagentName: 'Na Chlorid',
			quantityUnit: 'mg, bottle',
			quantity: 30,
			amount: 4,
			status: 'fulfilled',
			userComment: 'we need it asap',
			poComment: 'we have no enough money',
			createdAt: '2024-09-20T13:16:35.744Z',
			updatedAt: '2024-09-29T13:16:35.744Z',
			structure: 'H2SO4',
			casNumber: '1111111-11-1',
			orderId: '22a5974b-cb37-4ebd-9060-8cc131945517'
		}
	],
	count: 4
};

export const reagentDetails = [
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
		reagentName: 'Sodium Chloride',
		category: 'Reagent',
		description: 'Common salt used in various chemical reactions and as a preservative.',
		casNumber: '7647-14-5',
		producer: 'Chemical Co.',
		catalogId: 'CH-001234',
		catalogLink: 'http://chemicalco.com/catalog/sodium-chloride',
		quantityUnit: 'g',
		quantity: 500,
		unitPrice: 12.5,
		quantityLeft: 25.0,
		storageLocation: {
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
			name: 'Cabinet 1, shelf 3'
		},
		expirationDate: '2025-05-15T00:00:00.000Z'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b449',
		reagentName: 'Acetic Acid',
		category: 'Reagent',
		description:
			'A colorless liquid organic compound with a pungent smell used in the production of various chemicals.',
		casNumber: '64-19-7',
		producer: 'Pure Chemicals',
		catalogId: 'PC-002567',
		catalogLink: 'http://purechemicals.com/catalog/acetic-acid',
		quantityUnit: 'l, bottle',
		quantity: 100,
		unitPrice: 4,
		quantityLeft: 15.0,
		storageLocation: {
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b93f5g6d6d4g6g',
			name: 'Cabinet 2, shelf 4'
		},
		expirationDate: '2024-11-30T00:00:00.000Z'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b999',
		reagentName: 'Acetic Acid',
		category: 'Reagent',
		description:
			'A colorless liquid organic compound with a pungent smell used in the production of various chemicals.',
		casNumber: '64-19-7',
		producer: 'Pure Chemicals',
		catalogId: 'PC-002567',
		catalogLink: 'http://purechemicals.com/catalog/acetic-acid',
		quantityUnit: 'g',
		quantity: 1000,
		unitPrice: 8.99,
		quantityLeft: 15.0,
		storageLocation: {
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b93f5g6d6d4g6g',
			name: 'Cabinet 2, shelf 4'
		},
		expirationDate: '2024-11-30T00:00:00.000Z'
	}
];
