import { sql } from 'drizzle-orm';
import { schema } from '../../db/schema/index.js';
import { generateFilterByValueType } from './filter-by-value-type-generator.js';

function generateFilterSubquery(data, formatMapping, optionsDictionary) {
	const parsedData = JSON.parse(data);

	return Object.entries(parsedData)
		.map(([key, value]) => {
			const optionProperty = optionsDictionary[key.toLowerCase()]?.property;
			const schemaName = optionsDictionary[key.toLowerCase()]?.schema;

			if (!optionProperty) {
				return;
			}

			const filterKey =
				schemaName === 'union' ? sql.raw(`${optionProperty}`) : schema[schemaName][optionProperty];

			return generateFilterByValueType({ filterKey, value }, optionProperty, formatMapping);
		})
		.filter(Boolean);
}

export { generateFilterSubquery };
