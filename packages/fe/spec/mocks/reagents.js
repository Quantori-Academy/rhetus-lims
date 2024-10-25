import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';
import { samples } from './samples.js';

const reagents = [
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
		name: 'Sodium Chloride',
		category: 'Reagent',
		description: 'Common salt used in various chemical reactions and as a preservative.',
		quantityLeft: 500,
		quantityUnit: 'g',
		storageLocation: 'Shelf A1',
		structure: 'Cl[Na]'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b322',
		name: 'Acetic Acid',
		category: 'Reagent',
		description: 'Weak acid used in the production of synthetic fibers and food preservation.',
		quantityLeft: 1,
		quantityUnit: 'L',
		storageLocation: 'Cabinet B2',
		structure: 'CC(=O)O'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b999',
		name: 'Potassium Permanganate',
		category: 'Reagent',
		description: 'Used as an oxidant in various organic and inorganic reactions.',
		quantityLeft: 250,
		quantityUnit: 'g',
		storageLocation: 'Shelf C3',
		structure: 'O=[Mn](=O)(=O)=O[O-].[K+]'
	}
];

export const substances = [...reagents, ...samples];

const reagentDetails = [
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
		name: 'Sodium Chloride',
		category: 'Reagent',
		description: 'Common salt used in various chemical reactions and as a preservative.',
		casNumber: '7647-14-5',
		producer: 'Chemical Co.',
		catalogId: 'CH-001234',
		catalogLink: 'http://chemicalco.com/catalog/sodium-chloride',
		quantityUnit: 'g',
		quantity: 500,
		unitPrice: 12.5,
		quantityLeft: 25.0,
		storageLocationId: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
		expirationDate: '2025-05-15T00:00:00.000Z'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b322',
		name: 'Acetic Acid',
		category: 'Reagent',
		description:
			'A colorless liquid organic compound with a pungent smell used in the production of various chemicals.',
		casNumber: '64-19-7',
		producer: 'Pure Chemicals',
		catalogId: 'PC-002567',
		catalogLink: 'http://purechemicals.com/catalog/acetic-acid',
		unitSize: '1 L bottle',
		unitPrice: 8.99,
		quantityLeft: 15.0,
		storageLocationId: 'c7b3d8e0-5e0b-4b0f-8b3a-3b93f5g6d6d4g6g',
		expirationDate: '2024-11-30T00:00:00.000Z'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b999',
		name: 'Acetic Acid',
		category: 'Reagent',
		description:
			'A colorless liquid organic compound with a pungent smell used in the production of various chemicals.',
		casNumber: '64-19-7',
		producer: 'Pure Chemicals',
		catalogId: 'PC-002567',
		catalogLink: 'http://purechemicals.com/catalog/acetic-acid',
		quantityUnit: 'g',
		quantity: 1000,
		unitPrice: 8.99,
		quantityLeft: 15.0,
		storageLocationId: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
		expirationDate: '2024-11-30T00:00:00.000Z'
	}
];
const storageLocations = [
	{
		id: 1,
		room: 'Building 1, Room 2',
		name: 'Cabinet 3, Shelf 4'
	},
	{
		id: 2,
		room: 'Building 1, Room 3',
		name: 'Cabinet 1, Shelf 2'
	},
	{
		id: 3,
		room: 'Building 2, Room 1',
		name: 'Cabinet 2, Shelf 1'
	}
];
function findLocationByValue({ shelf, cabinet, room }) {
	const name = `${cabinet.trim().toLowerCase()}, ${shelf.trim().toLowerCase()}`;
	return storageLocations.find(
		location =>
			location.name.toLowerCase() === name &&
			location.room.toLowerCase() === room.trim().toLowerCase()
	);
}
function filterReagents(parsedOptions) {
	const filteredReagents = reagents.filter(reagent => {
		let matchesName = true;
		let matchesQuantity = true;
		if (parsedOptions.name) {
			matchesName = reagent.name.toLowerCase().includes(parsedOptions.name);
		}
		if (parsedOptions.quantity) {
			matchesQuantity = parseInt(reagent.quantityLeft) === parsedOptions.quantity;
		}
		return matchesName && matchesQuantity;
	});
	return HttpResponse.json({
		items: filteredReagents
	});
}
export const reagentsHandlers = [
	http.get(api('/reagents'), req => {
		const url = new URL(req.request.url);
		const options = url.searchParams.get('options');
		const parsedOptions = JSON.parse(options);
		if (parsedOptions === null) {
			return HttpResponse.json(reagents);
		} else {
			return filterReagents(parsedOptions);
		}
	}),
	http.get(api('/substances'), req => {
		const requestUrl = req.request.url;
		const url = new URL(requestUrl);
		const productIds = url.searchParams.get('sort');
		console.log(productIds);
		return HttpResponse.json({ substances, count: substances.length });
	}),
	http.delete(api('/reagents/:id'), async ({ params }) => {
		const { id } = params;
		console.log(id);
		const reagentIndex = reagents.findIndex(reagent => reagent.id === id);
		if (reagentIndex === -1) {
			return HttpResponse.json(
				{
					status: 'error',
					message: `Reagent not found`
				},
				{ status: 404 }
			);
		}
		reagents.splice(reagentIndex, 1);
		return HttpResponse.json({
			status: 'success',
			message: `Reagent was deleted`
		});
	}),
	http.get(api('/reagents/:id'), req => {
		const { id } = req.params;
		const reagent = reagentDetails.find(rg => rg.id === id);
		if (reagent) {
			return HttpResponse.json(reagent);
		} else {
			return HttpResponse.json({ message: 'Reagent not found' }, { status: 404 });
		}
	}),

	http.put(api('/reagents/:id'), async ({ request, params }) => {
		const { id } = params;
		const updatedReagent = await request.json();
		const reagent = reagentDetails.find(rg => rg.id === id);
		if (reagent) {
			Object.assign(reagent, updatedReagent);
			return HttpResponse.json(reagent);
		} else {
			return HttpResponse.json({ message: 'Reagent not found' }, { status: 404 });
		}
	}),

	http.post(api('/reagents'), async ({ request }) => {
		const reagent = await request.json();
		const { room, shelf, cabinet, ...rest } = reagent;

		const storageLocation = findLocationByValue({ shelf, cabinet, room });
		if (!storageLocation) {
			return HttpResponse.json(
				{
					status: 'error',
					message: `Location not found`
				},
				{ status: 404 }
			);
		}

		const newReagent = {
			...rest,
			storageLocationId: storageLocation.id
		};

		reagentDetails.push(newReagent);
		return HttpResponse.json({
			status: 'success',
			message: `New reagent was created`
		});
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
