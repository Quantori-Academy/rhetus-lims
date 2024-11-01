import { asc, desc, sql } from 'drizzle-orm';
import { servicesMapping } from './services/services-filter-sort-map.js';

function generateOrderSubquery(sortData, entityType) {
	return Object.entries(sortData)
		.map(([property, order]) => {
			const { property: sortProperty } =
				servicesMapping[entityType].sort[property.toLowerCase()] ?? {};
			const lowerCasedOrder = order ? order.toLowerCase() : null;

			if (!sortProperty || !['asc', 'desc'].includes(lowerCasedOrder)) {
				return;
			}

			return generateSubquery(sortProperty, lowerCasedOrder);
		})
		.filter(Boolean);
}

function generateSubquery(sortProperty, order) {
	if (typeof sortProperty === 'object') {
		return order === 'asc' ? asc(sortProperty) : desc(sortProperty);
	}

	return sql.raw(`${sortProperty} ${order}`);
}

export { generateOrderSubquery };
