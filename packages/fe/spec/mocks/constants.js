/* eslint-disable max-lines */
function pushToArray(targetArray, items) {
	if (items?.length > 0) {
		items.forEach(item => targetArray.push(item));
	}
}
function processNewReagents(newReagents) {
	return newReagents.map(req => {
		const newReg = {
			...req,
			tempId: '1f8616d7-5b77-4643-bc76-b493500c738d',
			reagentName: req.name
		};
		delete newReg.name;
		return newReg;
	});
}
function removeFromArray(targetArray, removeIds) {
	removeIds.forEach(id => {
		const index = targetArray.findIndex(existingItem => existingItem.tempId === id);
		if (index !== -1) {
			targetArray.splice(index, 1);
		}
	});
}
export function updateOrderReagents(targetOrder, reagentRequests, reagents, newReagents) {
	pushToArray(targetOrder.reagentRequests, reagentRequests);
	pushToArray(targetOrder.reagents, reagents);
	if (newReagents?.length > 0) {
		const processedNewReagents = processNewReagents(newReagents);
		processedNewReagents.forEach(newReg => targetOrder.reagents.push(newReg));
	}
}
export function removeOrderReagents(targetOrder, reagentRequests, reagents) {
	if (reagentRequests?.length > 0) {
		removeFromArray(targetOrder.reagentRequests, reagentRequests);
	}
	if (reagents?.length > 0) {
		removeFromArray(targetOrder.reagents, reagents);
	}
}

export const orderInfo = {
	orders: [
		{
			id: '82edd722-293b-4aed-bace-883a77946d99',
			title: 'Order for Sodium Chloride',
			createdAt: '2024-09-20T21:47:47.481Z',
			updatedAt: '2024-10-05T10:15:06.720Z',
			seller: 'LabChem',
			status: 'pending',
			author: {
				id: 2,
				username: 'username2'
			},
			reagentRequests: [
				{
					tempId: '1f8616d7-5b77-4643-bc76-b493500c738d',
					reagentName: 'good acid',
					quantity: 15.5,
					quantityUnit: 'ml, bottle',
					amount: 5,
					userComment: 'we need it asap',
					poComment: 'we have no enough money',
					createdAt: '2024-11-02T14:56:54.064Z',
					updatedAt: '2024-11-03T08:09:51.148Z',
					structure: 'H2SO4',
					casNumber: '1111111-11-1',
					author: {
						id: 1,
						username: 'username3'
					},
					status: 'pending',
					producer: '',
					catalogId: '',
					catalogLink: '',
					unitPrice: 0,
					orderId: null
				},
				{
					tempId: '1f8616d7-5b77-4643-bc76-b493500c738r',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'better acid',
					quantity: 17,
					quantityUnit: 'ml, bottle',
					amount: 10,
					status: 'ordered',
					userComment: 'we need it asap',
					poComment: "let's do it",
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '2222222-22-2',
					producer: '',
					catalogId: '',
					catalogLink: '',
					unitPrice: 0,
					orderId: null
				}
			],
			reagents: [
				{
					tempId: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
					author: {
						id: 1,
						username: 'username4'
					},
					reagentName: 'awesome acid',
					quantity: 1.5,
					quantityUnit: 'g',
					amount: 5,
					status: 'pending',
					userComment: 'we need it asap',
					poComment: 'we have no enough money',
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'Cl[Na]',
					casNumber: '1111111-11-1',
					producer: '',
					catalogId: '',
					catalogLink: '',
					unitPrice: 0,
					orderId: null
				}
			]
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
					tempId: '22a5974b-cb37-4ebd-9060-8cc131945517',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'good acid',
					quantity: 15.5,
					quantityUnit: 'ml, bottle',
					amount: 5,
					status: 'pending',
					userComment: 'we need it asap',
					poComment: 'we have no enough money',
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '1111111-11-1',
					producer: '',
					catalogId: '',
					catalogLink: '',
					unitPrice: 0,
					orderId: null
				},
				{
					tempId: '22a5974b-cb37-4ebd-9060-8cc131945517',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'better acid',
					quantity: 17,
					quantityUnit: 'ml, bottle',
					amount: 10,
					status: 'ordered',
					userComment: 'we need it asap',
					poComment: "let's do it",
					createdAt: '2024-09-20T21:47:47.481Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '2222222-22-2',
					producer: '',
					catalogId: '',
					catalogLink: '',
					unitPrice: 0,
					orderId: null
				}
			],
			reagents: [
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
			]
		},
		{
			id: '0c2243be-8325-41fd-bb47-3372be2eec04',
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
					tempId: '22a5974b-cb37-4ebd-9060-8cc131945517',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'good acid',
					quantity: 15.5,
					quantityUnit: 'ml, bottle',
					amount: 5,
					status: 'pending',
					userComment: 'we need it asap',
					poComment: 'we have no enough money',
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '1111111-11-1',
					producer: '',
					catalogId: '',
					catalogLink: '',
					unitPrice: 0,
					orderId: null
				},
				{
					tempId: '22a5974b-cb37-4ebd-9060-8cc131945516',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'better acid',
					quantity: 17,
					quantityUnit: 'ml, bottle',
					amount: 12,
					status: 'ordered',
					userComment: 'we need it asap',
					poComment: "let's do it",
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '2222222-22-2',
					producer: '',
					catalogId: '',
					catalogLink: '',
					unitPrice: 0,
					orderId: null
				}
			],
			reagents: [
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
			]
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
					tempId: '22a5974b-cb37-4ebd-9060-8cc131945517',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'good acid',
					quantity: 15.5,
					quantityUnit: 'ml, bottle',
					amount: 2,
					status: 'canceled',
					userComment: 'we need it asap',
					poComment: 'we have no enough money',
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '1111111-11-1',
					producer: '',
					catalogId: '',
					catalogLink: '',
					unitPrice: 0,
					orderId: null
				},
				{
					tempId: '22a5974b-cb37-4ebd-9060-8cc131945516',
					author: {
						id: 1,
						username: 'username3'
					},
					reagentName: 'better acid',
					quantity: 17,
					quantityUnit: 'ml, bottle',
					amount: 20,
					status: 'canceled',
					userComment: 'we need it asap',
					poComment: "let's do it",
					createdAt: '2024-09-27T13:16:35.744Z',
					updatedAt: '2024-09-27T13:16:35.744Z',
					structure: 'H2SO4',
					casNumber: '2222222-22-2',
					producer: '',
					catalogId: '',
					catalogLink: '',
					unitPrice: 0,
					orderId: null
				}
			],
			reagents: []
		}
	],
	count: 4
};
