import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';
import { orderInfo } from './constants.js';

function matchesTitle(order, title) {
	return title ? order.title.includes(title) : true;
}
function matchesStatus(order, status) {
	return status ? order.status.includes(status) : true;
}
function matchesDateRange(orderDate, dateRange) {
	if (dateRange && dateRange.length === 2) {
		const [startDate, endDate] = dateRange;
		const orderDateObj = new Date(orderDate);
		return orderDateObj >= new Date(startDate) && orderDateObj <= new Date(endDate);
	}
	return true;
}
function matchesCreationDate(order, createdAtRange) {
	return matchesDateRange(order.createdAt, createdAtRange);
}

function matchesUpdateDate(order, updatedAtRange) {
	return matchesDateRange(order.updatedAt, updatedAtRange);
}

function filterOrders(parsedOptions) {
	const filteredOrders = orderInfo.orders.filter(order => {
		return (
			matchesTitle(order, parsedOptions.title) &&
			matchesStatus(order, parsedOptions.status) &&
			matchesCreationDate(order, parsedOptions.createdAt) &&
			matchesUpdateDate(order, parsedOptions.updatedAt)
		);
	});
	return filteredOrders;
}

function paginateOrders(items, page, limit) {
	const start = (page - 1) * limit;
	return items.slice(start, start + limit);
}
const statusTransitions = {
	pending: 'ordered',
	ordered: 'fulfilled'
};

function changeStatus(order, action) {
	if (action === 'next') {
		const nextStatus = statusTransitions[order.status];
		if (nextStatus) {
			order.status = nextStatus;
		} else {
			return { success: false, message: 'Invalid transition from current status' };
		}
	} else if (action === 'cancel') {
		if (order.status === 'pending' || order.status === 'ordered') {
			order.status = 'canceled';
		} else {
			return { success: false, message: 'Order cannot be canceled from this status' };
		}
	}
	return { success: true, message: `Order status updated to ${order.status}` };
}
export const orderHandlers = [
	http.get(api('/orders'), req => {
		const url = new URL(req.request.url);
		const options = url.searchParams.get('options');
		const parsedOptions = options ? JSON.parse(options) : null;
		const page = parseInt(url.searchParams.get('page')) || 1;
		const limit = parseInt(url.searchParams.get('limit')) || 10;
		const hasValidOptions = options => {
			return options && Object.values(options).some(value => value !== '');
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
	http.post(api('/orders'), async req => {
		const order = await req.request.json();
		orderInfo.orders.push({
			...order,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			status: 'pending'
		});
		return HttpResponse.json({
			status: 'success',
			message: `Order was created`
		});
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
	}),
	http.put(api('/orders/:id/change-status'), async ({ request, params }) => {
		const body = await request.json();
		const { id } = params;
		const { action } = body;
		const order = orderInfo.orders.find(order => order.id === id);
		if (!order) return HttpResponse.json({ message: 'Order not found' }, { status: 404 });
		const result = changeStatus(order, action);
		if (!result.success) {
			return HttpResponse.json({ message: result.message }, { status: 400 });
		}
		return HttpResponse.json({ status: 'success', message: result.message });
	}),
	http.put(api('/orders/:id/remove-item'), async ({ request, params }) => {
		const body = await request.json();
		const { id } = params;
		const { reagentRequests, reagents } = body;
		let targetOrder = orderInfo.orders.filter(order => order.id === id)[0];

		const reagentIndex = targetOrder.reagents.findIndex(item => item.tempId === reagents[0]);
		if (reagentIndex !== -1) {
			targetOrder.reagents.splice(reagentIndex, 1);
			return HttpResponse.json({
				status: 'success',
				message: 'Item removed successfully'
			});
		}
		const requestIndex = targetOrder.reagentRequests.findIndex(
			item => item.tempId === reagentRequests[0]
		);
		if (requestIndex !== -1) {
			targetOrder.reagentRequests.splice(requestIndex, 1);
			return HttpResponse.json({
				status: 'success',
				message: 'Item removed successfully'
			});
		}
	}),
	http.put(api('/orders/:id/add-item'), async ({ request, params }) => {
		const item = await request.json();
		const { id } = params;
		for (const targetOrder of orderInfo.orders) {
			if (targetOrder.reagents.length === 0 && targetOrder.reagentRequests.length === 0) {
				continue;
			}
			const reagentExists = targetOrder.reagents.some(item => item.tempId === id);
			if (!reagentExists) {
				targetOrder.reagents.push(item);
				return HttpResponse.json({
					status: 'success',
					order: targetOrder
				});
			}
		}
		return HttpResponse.json({ status: 'error', message: 'Item not added to any order' });
	})
];
