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
			status: 'pending',
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

function filterRequests(parsedOptions) {
	const filteredRequests = requestInfo.requests.filter(request => {
		let matchesName = true;
		let matchesStatus = true;
		if (parsedOptions.reagentName) {
			matchesName = request.reagentName.toLowerCase().includes(parsedOptions.reagentName);
		}
		if (parsedOptions.status) {
			matchesStatus = request.status.includes(parsedOptions.status);
		}
		return matchesName && matchesStatus;
	});
	return HttpResponse.json({
		requests: filteredRequests
	});
}

export const requestHandlers = [
	http.get(api('/requests'), req => {
		const url = new URL(req.request.url);
		const options = url.searchParams.get('options');
		const parsedOptions = JSON.parse(options);
		if (parsedOptions === null) {
			return HttpResponse.json(requestInfo);
		} else {
			return filterRequests(parsedOptions);
		}
	})
];
