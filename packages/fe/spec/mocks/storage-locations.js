import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

const storageInfo = {
	storages: [
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
			room: 'Building 1, Room 12',
			name: 'Cabinet 1, shelf 3',
			description: 'This storage is located near the pool',
			isEmpty: false,
			creationDate: '2024-11-22T00:00:00.000Z'
		},
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b93f5g6d6d4g6g',
			room: 'Building 2, Room 23',
			name: 'Cabinet 2, shelf 4',
			isEmpty: false,
			creationDate: '2024-10-30T00:00:00.000Z'
		},
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3bunidabistded',
			room: 'Walk-in freezer',
			name: 'Cabinet 1, shelf 5',
			isEmpty: true,
			creationDate: '2024-11-25T00:00:00.000Z'
		}
	],
	count: 3
};

function filterStorages(parsedOptions) {
	const filteredStorages = storageInfo.storages.filter(storage => {
		let matchesRoom = true;
		let matchesName = true;
		if (parsedOptions.room) {
			matchesRoom = storage.room.includes(parsedOptions.room);
		}
		if (parsedOptions.name) {
			matchesName = storage.name.includes(parsedOptions.name);
		}
		return matchesRoom && matchesName;
	});
	return filteredStorages;
}
function paginateStorages(items, page, limit) {
	const start = (page - 1) * limit;
	return items.slice(start, start + limit);
}
export const storageLocationHandlers = [
	http.get(api('/storages'), req => {
		const url = new URL(req.request.url);
		const options = url.searchParams.get('options');
		const sort = JSON.parse(url.searchParams.get('sort')).creationDate;
		console.log(`Sort order: ${sort}`);
		const parsedOptions = JSON.parse(options);
		const page = parseInt(url.searchParams.get('page')) || 1;
		const limit = parseInt(url.searchParams.get('limit')) || 10;
		const hasValidOptions = options => {
			return Object.values(options).some(value => value !== '');
		};
		if (!hasValidOptions(parsedOptions)) {
			return HttpResponse.json({
				storages: paginateStorages(storageInfo.storages, page, limit),
				count: storageInfo.storages.length
			});
		} else {
			const filtered = filterStorages(parsedOptions);
			return HttpResponse.json({
				storages: paginateStorages(filtered, page, limit),
				count: filtered.length
			});
		}
	}),
	http.get(api('/storages/:id'), req => {
		const { id } = req.params;
		const storage = storageInfo.storages.find(location => location.id === id);
		if (!storage) {
			return HttpResponse.json({ message: 'Storage location is not found' }, { status: 404 });
		}
		return HttpResponse.json(storage);
	}),
	http.post(api('/storages'), async ({ request }) => {
		const storage = await request.json();
		storageInfo.storages.push(storage);
		return HttpResponse.json({
			status: 'success',
			message: `Storage location was created`
		});
	}),
	http.patch(api('/storages/:id'), async ({ request, params }) => {
		const { id } = params;
		const storage = storageInfo.storages.find(location => location.id === id);
		if (!storage) {
			return HttpResponse.json({ message: 'Storage location is not found' }, { status: 404 });
		}

		const updatedStorage = await request.json();
		Object.assign(storage, updatedStorage);
		return HttpResponse.json(
			{ status: 'success', message: `Storage location was updated` },
			{ status: 200 }
		);
	}),
	http.delete(api('/storages/:id'), async ({ params }) => {
		const { id } = params;
		const storageIndex = storageInfo.storages.findIndex(location => location.id === id);
		if (storageIndex === -1) {
			return HttpResponse.json(
				{
					status: 'error',
					message: 'Storage location is not found'
				},
				{ status: 404 }
			);
		}
		storageInfo.storages.splice(storageIndex, 1);
		return HttpResponse.json({
			status: 'success',
			message: 'Storage location was deleted'
		});
	})
];
