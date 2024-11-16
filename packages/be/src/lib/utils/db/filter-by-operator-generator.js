import { eq, inArray, ilike, between, or } from 'drizzle-orm';
import { isExactStructure } from '../../db/structure/utils/is-exact-structure.js';
import { hasSubstructure } from '../../db/structure/utils/has-substructure.js';
import { isSimilar } from '../../db/structure/utils/is-similar.js';

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

function generateStructureSearchFilter(filterKey, value) {
	return or(
		isExactStructure(filterKey, value),
		hasSubstructure(filterKey, value),
		isSimilar(filterKey, value)
	);
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

		case 'structure-search':
			return generateStructureSearchFilter(filterKey, value);

		default:
			return;
	}
}

export { generateFilterByOperator };
