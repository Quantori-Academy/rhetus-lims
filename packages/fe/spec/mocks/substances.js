import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';
import { samples } from './samples.js';
import { reagents } from './reagents.js';
import { storageInfo } from './storage-locations.js';

const substances = [...reagents, ...samples];

function filterSubstances(parsedOptions) {
	const filteredSubstances = substances.filter(reagent => {
		let matchesName = true;
		let matchesQuantity = true;
		let matchesLocation = true;

		if (parsedOptions.name) {
			matchesName = reagent.name.toLowerCase().includes(parsedOptions.name);
		}
		if (parsedOptions.quantity) {
			matchesQuantity = parseInt(reagent.quantityLeft) === parsedOptions.quantity;
		}
		if (parsedOptions.location) {
			matchesLocation = reagent.storageLocationId === parsedOptions.location;
		}
		return matchesName && matchesQuantity && matchesLocation;
	});
	return filteredSubstances;
}

function findStorgeById(id) {
	return storageInfo.storages.find(s => s.id === id);
}

export const substancesHandler = [
	http.get(api('/substances'), req => {
		const requestUrl = req.request.url;
		const url = new URL(requestUrl);
		const productIds = url.searchParams.get('sort');
		console.log(productIds);

		const page = parseInt(url.searchParams.get('page')) || 1;
		const limit = parseInt(url.searchParams.get('limit')) || 10;
		const start = (page - 1) * limit;
		const end = start + limit;

		const options = url.searchParams.get('options');
		const parsedOptions = JSON.parse(options);

		if (parsedOptions === null) {
			const paginatedSubstances = substances.slice(start, end);
			return HttpResponse.json({
				substances: paginatedSubstances.map(x => ({
					...x,
					storageLocation: findStorgeById(x.storageLocationId)
				})),
				count: substances.length
			});
		} else {
			const filteredSubstances = filterSubstances(parsedOptions);
			console.log(filteredSubstances);
			const paginatedSubstances = filteredSubstances.slice(start, end);
			return HttpResponse.json({
				substances: paginatedSubstances.map(x => ({
					...x,
					storageLocation: findStorgeById(x.storageLocationId)
				})),
				count: filteredSubstances.length
			});
		}
	}),

	http.patch(api('/substances/:id'), async ({ request, params }) => {
		const { id } = params;
		const body = await request.json();
		const { storageId, category } = body;
		const substance = substances.find(substance => substance.id === id);
		if (!substance) return HttpResponse.json({ message: 'Substance not found' }, { status: 404 });

		substance.storageLocationId = storageId;

		if (category.toLowerCase() === 'reagent') {
			const reagent = reagents.find(x => x.id === id);
			reagent.storageLocationId = storageId;
		} else {
			const sample = samples.find(x => x.id === id);
			sample.storageLocation = storageId;
		}

		return HttpResponse.json({ status: 'success', message: 'Updated substance storage' });
	}),

	http.put(api('/substances/quantity-change/:id'), async ({ request, params }) => {
		const body = await request.json();
		const { id } = params;
		const { quantityUsed, category } = body;
		const substance = substances.find(sample => sample.id === id);
		if (!substance) return HttpResponse.json({ message: 'Sample not found' }, { status: 404 });

		substance.quantityLeft -= quantityUsed;

		if (category.toLowerCase() === 'reagent') {
			const reagent = reagents.find(x => x.id === id);
			reagent.quantityLeft -= quantityUsed;
		} else {
			const sample = samples.find(x => x.id === id);
			sample.quantityLeft -= quantityUsed;
		}

		return HttpResponse.json({ status: 'success', message: 'Updated substance quantity' });
	})
];
