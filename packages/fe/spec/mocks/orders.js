import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';
const orderInfo = {
	orders: [
		{
			id: '1a3e8e10-723f-43c2-8c1a-41a0e6e0c497',
			author: {
				id: 2,
				username: 'username2'
			},
			title: 'Order for Sodium Chloride',
			createdAt: '2024-09-27T21:47:47.481Z',
			updatedAt: '2024-09-27T21:47:47.481Z',
			seller: 'LabChem',
			status: 'pending',
			requests: [
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
			createdAt: '2024-09-25T13:30:21.127Z',
			updatedAt: '2024-09-26T08:21:15.372Z',
			seller: 'BBR',
			status: 'ordered',
			requests: [
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
			id: '6b9f3d47-341b-43b8-8f99-c2c35e71366e',
			author: {
				id: 1,
				username: 'username1'
			},
			title: 'Order for Ethanol (99%)',
			createdAt: '2024-09-20T10:05:45.311Z',
			updatedAt: '2024-09-28T15:42:00.228Z',
			seller: 'ChemLab Central',
			status: 'completed',
			requests: [
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
		}
	],
	count: 3
};
function matchesTitle(order, title) {
	return title ? order.title.includes(title) : true;
}
function matchesStatus(order, status) {
	return status ? order.status.includes(status) : true;
}
function matchesCreationDate(order, creationDate) {
	return creationDate ? order.creationDate.includes(creationDate) : true;
}
function matchesModificationDate(order, modificationDate) {
	return modificationDate ? order.modificationDate.includes(modificationDate) : true;
}
function filterOrders(parsedOptions) {
	const filteredOrders = orderInfo.orders.filter(order => {
		return (
			matchesTitle(order, parsedOptions.title) &&
			matchesStatus(order, parsedOptions.status) &&
			matchesCreationDate(order, parsedOptions.creationDate) &&
			matchesModificationDate(order, parsedOptions.modificationDate)
		);
	});

	return filteredOrders;
}

function paginateOrders(items, page, limit) {
	const start = (page - 1) * limit;
	return items.slice(start, start + limit);
}
export const orderHandlers = [
	http.get(api('/orders'), req => {
		const url = new URL(req.request.url);
		const options = url.searchParams.get('options');
		const sort = url.searchParams.get('sort');
		if (sort) {
			console.log(`Sort order: ${sort}`);
		}
		const parsedOptions = JSON.parse(options) || {};
		const page = parseInt(url.searchParams.get('page')) || 1;
		const limit = parseInt(url.searchParams.get('limit')) || 10;
		const hasValidOptions = options => {
			return Object.values(options).some(value => value !== '');
		};
		if (!hasValidOptions(parsedOptions)) {
			return HttpResponse.json({
				orders: paginateOrders(orderInfo.orders, page, limit),
				count: orderInfo.orders.length
			});
		} else {
			const filtered = filterOrders(parsedOptions);
			return HttpResponse.json({
				orders: paginateOrders(filtered, page, limit),
				count: filtered.length
			});
		}
	}),
	http.get(api('/orders/:id'), req => {
		const { id } = req.params;
		const order = orderInfo.orders.find(o => o.id === id);
		if (!order) {
			return HttpResponse.json({ message: 'Order is not found' }, { status: 404 });
		}
		return HttpResponse.json(order);
	}),
	http.patch(api('/orders/:id'), async ({ request, params }) => {
		const { id } = params;
		const order = orderInfo.orders.find(o => o.id === id);
		if (!order) {
			return HttpResponse.json({ message: 'Order is not found' }, { status: 404 });
		}

		const updatedOrder = await request.json();
		Object.assign(order, updatedOrder);
		return HttpResponse.json({ status: 'success', message: `Order was updated` }, { status: 200 });
	}),
	http.delete(api('/orders/:id'), async ({ params }) => {
		const { id } = params;
		const orderIndex = orderInfo.orders.findIndex(o => o.id === id);
		if (orderIndex === -1) {
			return HttpResponse.json(
				{
					status: 'error',
					message: 'Order is not found'
				},
				{ status: 404 }
			);
		}
		orderInfo.orders.splice(orderIndex, 1);
		return HttpResponse.json({
			status: 'success',
			message: 'Order was deleted'
		});
	})
];
