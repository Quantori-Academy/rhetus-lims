import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

const storageInfo = {
	storages: [
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
			room: 'Building 1, Room 12',
			name: 'Cabinet 1, shelf 3',
			description: 'This storage is located near the pool',
			isEmpty: false
		},
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b93f5g6d6d4g6g',
			room: 'Building 2, Room 23',
			name: 'Cabinet 2, shelf 4',
			isEmpty: false
		},
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3bunidabistded',
			room: 'Walk-in freezer',
			name: 'Cabinet 1, shelf 5',
			isEmpty: true
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
	return HttpResponse.json({
		storages: filteredStorages
	});
}

export const storageLocationHandlers = [
	http.get(api('/storages'), req => {
		const url = new URL(req.request.url);
		const options = url.searchParams.get('options');
		const parsedOptions = JSON.parse(options);
		if (parsedOptions === null) {
			return HttpResponse.json(storageInfo);
		} else {
			return filterStorages(parsedOptions);
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
		console.log(storage)
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
