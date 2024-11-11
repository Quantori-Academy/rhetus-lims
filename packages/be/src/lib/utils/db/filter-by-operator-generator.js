import { eq, inArray, ilike, between } from 'drizzle-orm';
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

function structureSearchQuery(filterKey, value) {
	const match = value.match || 'exact';

	switch (match) {
		case 'exact':
			return isExactStructure(filterKey, value.smiles);
		case 'substructure':
			return hasSubstructure(filterKey, value.smiles);
		case 'similar':
			return isSimilar(filterKey, value.smiles);
		default:
			return;
	}
}

function generateStructureSearchFilter(filterKey, value) {
	if (!(value !== null && typeof value === 'object' && !Array.isArray(value))) {
		throw new Error('Structure filter should be a valid object.');
	}

	if (!value.smiles) {
		throw new Error('Structure filter should contain a smiles string.');
	}

	return structureSearchQuery(filterKey, value);
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
