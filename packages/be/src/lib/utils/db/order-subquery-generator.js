import { asc, desc, sql } from 'drizzle-orm';

function generateOrderSubquery(data, sortDictionary) {
	const parsedData = JSON.parse(data);

	return Object.entries(parsedData)
		.map(([property, order]) => {
			const sortProperty = sortDictionary[property.toLowerCase()];
			const lowerCasedOrder = order.toLowerCase();

			if (!sortProperty || !['asc', 'desc'].includes(lowerCasedOrder)) {
				return;
			}

			if (typeof sortProperty === 'object') {
				return lowerCasedOrder === 'asc' ? asc(sortProperty) : desc(sortProperty);
			}

			return sql.raw(`${sortProperty} ${lowerCasedOrder}`);
		})
		.filter(subquery => subquery);
}

export { generateOrderSubquery };
