import { eq, inArray, ilike, between } from 'drizzle-orm';

function generateArrayFilter(filterKey, value, formatValue) {
	return inArray(
		filterKey,
		value.map(item => formatValue(item))
	);
}

function generateIlikeFilter(filterKey, value) {
	return ilike(filterKey, `%${value}%`);
}

function generateEqualFilter(filterKey, value, formatValue) {
	if (Array.isArray(value)) {
		return generateArrayFilter(filterKey, value, formatValue);
	}

	return eq(filterKey, formatValue(value));
}

function generateBetweenFilter(filterKey, value, formatValue) {
	if (!Array.isArray(value) || value.length !== 2) {
		throw new Error('Between filter value should be an array with 2 defined elements.');
	}

	const [startValue, endValue] = value;

	return between(filterKey, formatValue(startValue), formatValue(endValue));
}

function generateFilterByOperator(filterData) {
	const { filterKey, value, operator, formatValue } = filterData;

	switch (operator) {
		case 'equal':
			return generateEqualFilter(filterKey, value, formatValue);

		case 'ilike':
			return generateIlikeFilter(filterKey, value);

		case 'between':
			return generateBetweenFilter(filterKey, value, formatValue);

		default:
			return;
	}
}

export { generateFilterByOperator };
