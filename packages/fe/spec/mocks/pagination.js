import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';
const users = [
	{
		id: 'a7b3d8e0-5e0b-4b0f-8b3a-1b9f4b3d3a2d',
		username: 'molecule_master',
		firstName: 'Anna',
		lastName: 'Smith',
		email: 'anna.smith@chemistry.com',
		role: 'Admin',
		creationDate: '2022-04-12'
	},
	{
		id: 'b7c4e8f1-6d0b-5c1f-9c4a-2d4f6c7d2c9e',
		username: 'reaction_queen',
		firstName: 'Bella',
		lastName: 'Rogers',
		email: 'bella.rogers@organicchem.com',
		role: 'Moderator',
		creationDate: '2022-05-10'
	},
	{
		id: 'd6e5f9a2-3b2c-8a9f-7c5b-4d7e3f1b1f5a',
		username: 'synthesis_sorcerer',
		firstName: 'Charlie',
		lastName: 'Johnson',
		email: 'charlie.johnson@chemistryworld.com',
		role: 'User',
		creationDate: '2022-06-15'
	},
	{
		id: 'e7f6a8b3-4c3d-9b6f-1c6c-8e5f4c7d7d8a',
		username: 'compound_wizard',
		firstName: 'David',
		lastName: 'Lee',
		email: 'david.lee@biochem.com',
		role: 'User',
		creationDate: '2022-07-20'
	},
	{
		id: 'f8g7b9c4-5d4e-1c7d-2d7d-9f6e5d8e9f9b',
		username: 'chemical_artist',
		firstName: 'Emily',
		lastName: 'Davis',
		email: 'emily.davis@labgenius.com',
		role: 'User',
		creationDate: '2022-08-25'
	},
	{
		id: 'g9h8c1d5-6e5f-2d8e-3e8e-0g7f6g1f1g2c',
		username: 'reaction_runner',
		firstName: 'Frank',
		lastName: 'Wilson',
		email: 'frank.wilson@chemicalhub.com',
		role: 'Moderator',
		creationDate: '2022-09-30'
	},
	{
		id: 'h0i9d2e6-7f6g-3e9f-4f9f-1h8g7h2g2h3d',
		username: 'lab_lurker',
		firstName: 'Grace',
		lastName: 'Miller',
		email: 'grace.miller@sciencelab.com',
		role: 'Admin',
		creationDate: '2022-10-10'
	},
	{
		id: 'i1j0e3f7-8g7h-4f0g-5g0g-2i9h8i3h3i4e',
		username: 'synthesis_superstar',
		firstName: 'Henry',
		lastName: 'Brown',
		email: 'henry.brown@chemlab.com',
		role: 'User',
		creationDate: '2022-11-15'
	},
	{
		id: 'j2k1f4g8-9h8i-5g1h-6h1h-3j0i9j4i4j5f',
		username: 'reaction_rebel',
		firstName: 'Isabella',
		lastName: 'Martinez',
		email: 'isabella.martinez@orglabs.com',
		role: 'User',
		creationDate: '2022-12-20'
	}
];

export const paginationHandlers = [
	http.get(api('/substances'), req => {
		const url = new URL(req.request.url);
		const page = parseInt(url.searchParams.get('page')) || 1;
		const limit = parseInt(url.searchParams.get('limit')) || 10;
		// const sort = url.searchParams.get('sort') ? JSON.parse(url.searchParams.get('sort')) : {};
		// if (Object.values(sort).length !== 0) {
		// 	const parsedSort = JSON.parse(decodeURIComponent(sort.replace('&sort=', '')));
		// 	let sortedUsers = [...users];
		// 	const [sortField, sortOrder] = Object.entries(parsedSort)[0];
		// 	const compare = (a, b) => {
		// 		const aField = a[sortField];
		// 		const bField = b[sortField];
		// 		const orderModifier = sortOrder === 'asc' ? 1 : -1;
		// 		if (typeof aField === 'string' && typeof bField === 'string') {
		// 			return orderModifier * aField.localeCompare(bField);
		// 		}
		// 		if (typeof aField === 'number' && typeof bField === 'number') {
		// 			return orderModifier * (aField - bField);
		// 		}
		// 		return 0;
		// 	};
		// 	sortedUsers.sort(compare);
		// }
		const start = (page - 1) * limit;
		const end = start + limit;
		const paginatedReagents = users.slice(start, end);
		return HttpResponse.json({
			items: paginatedReagents,
			total: users.length
		});
	})
];
