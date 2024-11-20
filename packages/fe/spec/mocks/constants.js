export const orderInfo = {
	orders: [
		{
			id: '1a3e8e10-723f-43c2-8c1a-41a0e6e0c497',
			author: {
				id: 2,
				username: 'username2'
			},
			title: 'Order for Sodium Chloride',
			createdAt: '2024-09-20T21:47:47.481Z',
			updatedAt: '2024-10-05T10:15:06.720Z',
			seller: 'LabChem',
			status: 'pending',
			reagentRequests: [
				{
					id: '22a5974b-cb37-4ebd-9060-8cc131945517',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'good acid',
					quantity: 15.5,
					status: 'pending',
					userComment: 'we need it asap',
					poComment: 'we have no enough money',
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '1111111-11-1',
					orderId: null
				},
				{
					id: '22a5974b-cb37-4ebd-9060-8cc131945517',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'better acid',
					quantity: 17,
					status: 'ordered',
					userComment: 'we need it asap',
					poComment: "let's do it",
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '2222222-22-2',
					orderId: null
				}
			],
			reagents: []
		},
		{
			id: 'f45d8c2a-0a17-4e2a-9d77-7f6b2b7cfd63',
			author: {
				id: 4,
				username: 'username4'
			},
			title: 'Order for Acetic Acid Solution',
			createdAt: '2024-09-22T21:47:47.481Z',
			updatedAt: '2024-10-02T10:15:06.720Z',
			seller: 'BBR',
			status: 'ordered',
			reagentRequests: [
				{
					id: '22a5974b-cb37-4ebd-9060-8cc131945517',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'good acid',
					quantity: 15.5,
					status: 'pending',
					userComment: 'we need it asap',
					poComment: 'we have no enough money',
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '1111111-11-1',
					orderId: null
				},
				{
					id: '22a5974b-cb37-4ebd-9060-8cc131945517',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'better acid',
					quantity: 17,
					status: 'ordered',
					userComment: 'we need it asap',
					poComment: "let's do it",
					createdAt: '2024-09-20T21:47:47.481Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '2222222-22-2',
					orderId: null
				}
			],
			reagents: []
		},
		{
			id: '6b9f3d47-341b-43b8-8f99-c2c35e71366e',
			author: {
				id: 1,
				username: 'username1'
			},
			title: 'Order for Ethanol (99%)',
			createdAt: '2024-09-20T10:05:45.311Z',
			updatedAt: '2024-10-05T10:15:06.720Z',
			seller: 'ChemLab Central',
			status: 'fulfilled',
			reagentRequests: [
				{
					id: '22a5974b-cb37-4ebd-9060-8cc131945517',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'good acid',
					quantity: 15.5,
					status: 'pending',
					userComment: 'we need it asap',
					poComment: 'we have no enough money',
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '1111111-11-1',
					orderId: null
				},
				{
					id: '22a5974b-cb37-4ebd-9060-8cc131945516',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'better acid',
					quantity: 17,
					status: 'ordered',
					userComment: 'we need it asap',
					poComment: "let's do it",
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '2222222-22-2',
					orderId: null
				}
			],
			reagents: []
		},
		{
			id: '6b9f3d47-341b-43b8-8f99-c2c35e71366h',
			author: {
				id: 1,
				username: 'username1'
			},
			title: 'Order for Xylene',
			createdAt: '2024-09-22T10:05:45.311Z',
			updatedAt: '2024-10-10T10:15:06.720Z',
			seller: 'Chems',
			status: 'canceled',
			reagentRequests: [
				{
					id: '22a5974b-cb37-4ebd-9060-8cc131945517',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'good acid',
					quantity: 15.5,
					status: 'canceled',
					userComment: 'we need it asap',
					poComment: 'we have no enough money',
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '1111111-11-1',
					orderId: null
				},
				{
					id: '22a5974b-cb37-4ebd-9060-8cc131945516',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'better acid',
					quantity: 17,
					status: 'canceled',
					userComment: 'we need it asap',
					poComment: "let's do it",
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '2222222-22-2',
					orderId: null
				}
			],
			reagents: []
		}
	],
	count: 4
};
