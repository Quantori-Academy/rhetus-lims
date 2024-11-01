import { generateOrderSubquery } from './order-subquery-generator.js';

function applySorting(query, sortData, entityType) {
	if (!sortData) {
		return query;
	}

	const orderSubqueries = generateOrderSubquery(sortData, entityType);

	return query.orderBy(...orderSubqueries);
}

export { applySorting };
