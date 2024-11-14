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
export const orderHandlers = [
	http.get(api('/orders'), req => {
		const url = new URL(req.request.url);
		const options = url.searchParams.get('options');
		const parsedOptions = options ? JSON.parse(options) : null;
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
