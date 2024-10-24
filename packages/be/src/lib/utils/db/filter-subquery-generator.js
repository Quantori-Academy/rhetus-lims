import { sql } from 'drizzle-orm';
import { schema } from '../../db/schema/index.js';
import { generateFilterByValueType } from './filter-by-value-type-generator.js';
import { trimValue } from './trim-value.js';
import { isDefine } from './check-value-define.js';

function generateFilterSubquery(data, formatMapping, optionsDictionary) {
	const parsedData = JSON.parse(data);

	return Object.entries(parsedData)
		.map(([key, value]) => {
			const optionProperty = optionsDictionary[key.toLowerCase()]?.property;
			const schemaName = optionsDictionary[key.toLowerCase()]?.schema;
			const trimmedValue = trimValue(value);

			if (!optionProperty || !isDefine(trimmedValue)) {
				return;
			}

			const filterKey =
				schemaName === 'union' ? sql.raw(`${optionProperty}`) : schema[schemaName][optionProperty];

			return generateFilterByValueType(
				{ filterKey, value: trimmedValue },
				optionProperty,
				formatMapping
			);
		})
		.filter(Boolean);
}

export { generateFilterSubquery };
