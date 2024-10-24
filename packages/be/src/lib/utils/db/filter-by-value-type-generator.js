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
		Object.entries(formatMapping).length !== 0
			? value.map(item => formatMapping[optionProperty](item))
			: value
	);
}

function generateFilterByValueType(filterData, optionProperty, formatMapping) {
	const { filterKey, value } = filterData;

	if (Array.isArray(value)) {
		return generateArrayFilter(filterData, optionProperty, formatMapping);
	}

	if (Date.parse(value) && Date.parse(value) > 0 && !Number.isInteger(Number(value))) {
		return generateDateFilter(filterKey, value);
	}

	return generateDefaultFilter(
		filterKey,
		Object.entries(formatMapping).length !== 0 ? formatMapping[optionProperty](value) : value
	);
}

export { generateFilterByValueType };
