import { generateFilterSubquery } from './filter-subquery-generator.js';
import { and } from 'drizzle-orm';

function applyFilters(query, filterData, entityType) {
	if (!filterData) {
		return query;
	}

	const filterSubQueries = generateFilterSubquery(filterData, entityType);

	return query.where(and(...filterSubQueries));
}

export { applyFilters };
