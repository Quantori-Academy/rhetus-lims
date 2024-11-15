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
				id: 35,
				username: 'po1'
			},
			status: 'pending',
			order: {
				title: 'Tr order',
				id: '82edd722-293b-4aed-bace-883a77946d99',
				createdAt: '2024-11-10T22:45:21.174Z',
				updatedAt: '2024-11-10T22:45:21.174Z',
				seller: 'Seller ltd',
				status: 'pending',
				author: {
					id: 35,
					username: 'po1'
				}
			}
		},
		{
			id: '1f8616d7-5b77-4643-bc76-b493500c738d',
			reagentName: 'Admin one',
			quantity: 15.5,
			quantityUnit: 'ml, bottle',
			amount: 1,
			userComment: 'jjj',
			poComment: '',
			createdAt: '2024-11-02T14:56:54.064Z',
			updatedAt: '2024-11-03T08:09:51.148Z',
			structure: 'H2SO4',
			casNumber: '1111111-11-1',
			author: {
				id: 25,
				username: 'adminuser2'
			},
			status: 'ordered',
			order: {}
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
				id: 25,
				username: 'adminuser2'
			},
			status: 'pending',
			order: {}
		}
	],
	count: 3
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
		const url = new URL(req.request.url);
		const options = url.searchParams.get('options');
		const sort = url.searchParams.get('sort');
		const parsedOptions = JSON.parse(options) || {};
		const hasValidOptions = options => {
			return Object.values(options).some(value => value !== '');
		};
		if (!hasValidOptions(parsedOptions)) {
			return HttpResponse.json({
				requests: requestInfo.requests, //to complete with pagination
				count: requestInfo.requests.length
			});
		} else {
			const filtered = filterRequests(parsedOptions);
			return HttpResponse.json({
				requests: filtered,
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
