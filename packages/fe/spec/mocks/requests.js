import { http, HttpResponse } from 'msw';
import { api } from './api-url';

const requestInfo = {
	requests: [
		{
			id: 'c10cb7e2-8b8d-4d89-a284-e703e369ca64',
			reagentName: 'Not admin 03-11',
			quantity: 18,
			quantityUnit: 'g, box',
			amount: 5,
			userComment: 'we need it asap',
			poComment: '',
			createdAt: '2024-11-11T09:55:38.531Z',
			updatedAt: '2024-11-11T09:55:38.531Z',
			structure: '',
			casNumber: '2222222-22-2',
			author: {
				id: 'c7b3d8e0-5e0b-4b0f-8b3a-4f9f4b3d3b333',
				username: 'test1'
			},
			status: 'pending',
			order: null
		},
		{
			id: '1f8616d7-5b77-4643-bc76-b493500c738d',
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
				id: 25,
				username: 'adminuser2'
			},
			status: 'ordered',
			producer: '',
			catalogId: '',
			catalogLink: '',
			unitPrice: 0,
			order: {
				id: '82edd722-293b-4aed-bace-883a77946d99',
				title: 'Order for Sodium Chloride',
				createdAt: '2024-09-20T21:47:47.481Z',
				updatedAt: '2024-10-05T10:15:06.720Z',
				seller: 'LabChem',
				status: 'pending',
				author: {
					id: 2,
					username: 'username2'
				}
			}
		},
		{
			id: '1f8616d7-5b77-4643-bc76-b493500c738r',
			reagentName: 'better acid',
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
			status: 'ordered',
			producer: '',
			catalogId: '',
			catalogLink: '',
			unitPrice: 0,
			order: {
				id: '82edd722-293b-4aed-bace-883a77946d99',
				title: 'Order for Sodium Chloride',
				createdAt: '2024-07-20T21:47:47.481Z',
				updatedAt: '2024-10-05T10:15:06.720Z',
				seller: 'LabChem',
				status: 'pending',
				author: {
					id: 2,
					username: 'username2'
				}
			}
		},
		{
			id: '1f8616d7-5b77-4643-bc76-b493500534c6',
			reagentName: 'Water',
			quantity: 30,
			quantityUnit: 'ml, bottle',
			amount: 1,
			userComment: 'comment',
			poComment: '',
			createdAt: '2024-11-02T14:56:54.064Z',
			updatedAt: '2024-11-03T08:09:51.148Z',
			structure: 'H2SO4',
			casNumber: '1111111-11-1',
			author: {
				id: '0',
				username: 'test1'
			},
			status: 'pending',
			order: {}
		}
	],
	count: 3
};

function dateFilter(request, parsedDate) {
	if (parsedDate && parsedDate.length === 2) {
		const [startDate, endDate] = parsedDate;
		const orderDateObj = new Date(request);
		return orderDateObj >= new Date(startDate) && orderDateObj <= new Date(endDate);
	}
	return true;
}
function matchesName(request, name) {
	return name ? request.reagentName.toLowerCase().includes(name) : true;
}
function matchesStatus(request, status) {
	return status ? request.status.includes(status) : true;
}
function matchesCreationDate(request, creationRange) {
	return dateFilter(request.createdAt, creationRange);
}
function matchesUpdateDate(request, updateRange) {
	return dateFilter(request.updatedAt, updateRange);
}
function filterRequests(parsedOptions) {
	const filteredRequests = requestInfo.requests.filter(request => {
		return (
			matchesName(request, parsedOptions.reagentName) &&
			matchesStatus(request, parsedOptions.status) &&
			matchesCreationDate(request, parsedOptions.creationRange) &&
			matchesUpdateDate(request, parsedOptions.updateRange)
		);
	});
	return filteredRequests;
}
function paginateRequests(items, page, limit) {
	const start = (page - 1) * limit;
	return items.slice(start, start + limit);
}
export const requestHandlers = [
	http.get(api('/requests'), req => {
		const url = new URL(req.request.url);
		const options = url.searchParams.get('options');
		const parsedOptions = JSON.parse(options) || {};
		const page = parseInt(url.searchParams.get('page')) || 1;
		const limit = parseInt(url.searchParams.get('limit')) || 10;
		const hasValidOptions = options => {
			return Object.values(options).some(value => value !== '');
		};
		if (!hasValidOptions(parsedOptions)) {
			return HttpResponse.json({
				requests: paginateRequests(requestInfo.requests, page, limit),
				count: requestInfo.requests.length
			});
		} else {
			const filtered = filterRequests(parsedOptions);
			return HttpResponse.json({
				requests: paginateRequests(filtered, page, limit),
				count: filtered.length
			});
		}
	}),
	http.post(api('/requests'), async ({ request }) => {
		const newRequest = await request.json();
		requestInfo.requests.push(newRequest);
		return HttpResponse.json({
			status: 'success',
			message: 'New request was created'
		});
	}),
	http.put(api('/requests/:id/cancel'), async ({ params }) => {
		const { id } = params;
		const requestIndex = requestInfo.requests.findIndex(request => request.id === id);
		if (requestIndex === -1) {
			return HttpResponse.json(
				{
					status: 'error',
					message: `Request not found`
				},
				{ status: 404 }
			);
		}
		requestInfo.requests.filter(request => request.id === id)[0].status = 'canceled';
		return HttpResponse.json({
			status: 'success',
			message: 'Request was canceled'
		});
	}),
	http.get(api('/requests/:id'), req => {
		const { id } = req.params;
		const request = requestInfo.requests.find(req => req.id === id);
		if (request) {
			return HttpResponse.json(request);
		} else {
			return HttpResponse.json({ message: 'Request not found' }, { status: 404 });
		}
	}),
	http.delete(api('/requests/:id'), async ({ params }) => {
		const { id } = params;
		const requestIndex = requestInfo.requests.findIndex(request => request.id === id);
		if (requestIndex === -1) {
			return HttpResponse.json(
				{
					status: 'error',
					message: `Request not found`
				},
				{ status: 404 }
			);
		}
		requestInfo.requests.splice(requestIndex, 1);
		return HttpResponse.json({
			status: 'success',
			message: 'Request was deleted'
		});
	})
];
