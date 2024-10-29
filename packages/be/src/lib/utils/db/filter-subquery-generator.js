import { sql } from 'drizzle-orm';
import { schema } from '../../db/schema/index.js';
import { generateFilterByOperator } from './filter-by-operator-generator.js';
import { helpers } from '../common/helpers.js';
import { isDefine } from '../common/check-value-define.js';
import { servicesMapping } from './services/services-filter-sort-map.js';

function generateFilterSubquery(data, entityType) {
	return Object.entries(data)
		.map(([key, value]) => {
			const {
				property: filterProperty,
				schema: schemaName,
				operator = null,
				value: formatValue
			} = servicesMapping[entityType].filter[key.toLowerCase()] ?? {};

			const trimmedValue = helpers.trim(value);

			if (!filterProperty || !isDefine(trimmedValue)) {
				return;
			}

			const filterKey =
				schemaName === 'union' ? sql.raw(`${filterProperty}`) : schema[schemaName][filterProperty];

			return generateFilterByOperator({ filterKey, value: trimmedValue, operator, formatValue });
		})
		.filter(Boolean);
}

export { generateFilterSubquery };
