import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';
import { samples } from './samples.js';

export const reagents = [
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
		name: 'Sodium Chloride',
		category: 'Reagent',
		description: 'Common salt used in various chemical reactions and as a preservative.',
		quantityLeft: 500,
		quantityUnit: 'g',
		storageLocationId: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
		structure: 'Cl[Na]'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b322',
		name: 'Acetic Acid',
		category: 'Reagent',
		description: 'Weak acid used in the production of synthetic fibers and food preservation.',
		quantityLeft: 1,
		quantityUnit: 'L',
		storageLocationId: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
		structure: 'CC(=O)O'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b999',
		name: 'Potassium Permanganate',
		category: 'Reagent',
		description: 'Used as an oxidant in various organic and inorganic reactions.',
		quantityLeft: 250,
		quantityUnit: 'g',
		storageLocationId: 'c7b3d8e0-5e0b-4b0f-8b3a-3b93f5g6d6d4g6g',
		structure: 'O=[Mn](=O)(=O)=O[O-].[K+]'
	}
];

const substances = [...reagents, ...samples];

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
		storageLocation: {
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
			name: 'Cabinet 1, shelf 3'
		},
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
		storageLocation: {
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
			name: 'Cabinet 1, shelf 3'
		},
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
		storageLocation: {
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b93f5g6d6d4g6g',
			name: 'Cabinet 2, shelf 4'
		},
		expirationDate: '2024-11-30T00:00:00.000Z'
	}
];
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
	http.delete(api('/reagents/:id'), async ({ params }) => {
		const { id } = params;
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
		reagentDetails.push(reagent);
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
