import { eq, inArray } from 'drizzle-orm';
import { schema } from '../../db/schema/index.js';

function generateFilterSubquery(data, formatMapping, optionsDictionary) {
	const parsedData = JSON.parse(data);
	return Object.entries(parsedData).map(([key, value]) => {
		const optionProperty = optionsDictionary[key.toLowerCase()].property;
		const schemaName = optionsDictionary[key.toLowerCase()].schema;

		if (!optionProperty) {
			return;
		}

		const filterKey = schema[schemaName][optionProperty];

		if (Date.parse(value) && !Number.isInteger(value)) {
			return eq(filterKey, new Date(value));
		}

		return Array.isArray(value)
			? inArray(
					filterKey,
					value.map(item => formatMapping[optionProperty](item))
				)
			: eq(filterKey, formatMapping[optionProperty](value));
	});
}

export { generateFilterSubquery };
