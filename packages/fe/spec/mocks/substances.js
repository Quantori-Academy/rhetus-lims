import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';
import { samples } from './samples.js';
import { reagents } from './reagents.js';

const substances = [...reagents, ...samples];

export const substancesHandler = [
	http.get(api('/substances'), req => {
		const requestUrl = req.request.url;
		const url = new URL(requestUrl);
		const productIds = url.searchParams.get('sort');
		console.log(productIds);

		const options = url.searchParams.get('options');
		const parsedOptions = JSON.parse(options);
		const storageId = parsedOptions?.location;
		if (storageId) {
			const filteredSubstances = substances.filter(
				substance => substance.storageLocationId === storageId
			);
			return HttpResponse.json({
				substances: filteredSubstances,
				count: filteredSubstances.length
			});
		}
		return HttpResponse.json({ substances, count: substances.length });
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
	})
];
