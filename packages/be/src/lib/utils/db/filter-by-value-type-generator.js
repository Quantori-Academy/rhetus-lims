import { eq, inArray, sql } from 'drizzle-orm';

function generateDefaultFilter(filterKey, formattedValue) {
	return eq(filterKey, formattedValue);
}

function generateDateFilter(filterKey, value) {
	return eq(filterKey, sql.raw(`'${new Date(value).toISOString()}'`));
}

function generateArrayFilter(filterData, optionProperty, formatMapping) {
	const { filterKey, value } = filterData;

	return inArray(
		filterKey,
		value.map(item => formatMapping[optionProperty](item))
	);
}

function generateFilterByValueType(filterData, optionProperty, formatMapping) {
	const { filterKey, value } = filterData;

	if (Array.isArray(value)) {
		return generateArrayFilter(filterData, optionProperty, formatMapping);
	}

	if (Date.parse(value) && !Number.isInteger(Number(value))) {
		return generateDateFilter(filterKey, value);
	}

	return generateDefaultFilter(filterKey, formatMapping[optionProperty](value));
}

export { generateFilterByValueType };
