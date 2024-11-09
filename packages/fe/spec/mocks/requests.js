import { http, HttpResponse } from 'msw';
import { api } from './api-url';

const requestInfo = {
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
			quantity: 17,
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
			quantity: 20,
			status: 'pending',
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
			quantity: 10,
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

function createdDateFilter(parsedOptions, request) {
	let [createdStartDate, createdEndDate] = parsedOptions.creationRange.map(date => new Date(date));
	const createdAt = new Date(request.createdAt);
	return createdAt >= createdStartDate && createdAt <= createdEndDate;
}

function filterRequests(parsedOptions) {
	const filteredRequests = requestInfo.requests.filter(request => {
		const matchesName = parsedOptions.reagentName
			? request.reagentName.toLowerCase().includes(parsedOptions.reagentName)
			: true;
		const matchesStatus = parsedOptions.status
			? request.status.includes(parsedOptions.status)
			: true;
		const matchesCreationDate = parsedOptions.creationRange
			? createdDateFilter(parsedOptions, request)
			: true;

		return matchesName && matchesStatus && matchesCreationDate;
	});
	return HttpResponse.json({
		requests: filteredRequests
	});
}

export const requestHandlers = [
	http.get(api('/requests'), req => {
		const options = new URL(req.request.url).searchParams.get('options');
		const parsedOptions = options ? JSON.parse(options) : null;
		if (parsedOptions === null) {
			return HttpResponse.json(requestInfo);
		} else {
			return filterRequests(parsedOptions);
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
			message: 'Request was canceled'
		});
	})
];
