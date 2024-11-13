import { sql } from 'drizzle-orm';
import { isExactStructure } from './is-exact-structure.js';
import { hasSubstructure } from './has-substructure.js';
import { isSimilar } from './is-similar.js';

function getRelevanceScore(columnName, smiles) {
	const column = sql.raw(columnName);

	return sql`
	CASE
			 WHEN ${isExactStructure(column, smiles)} THEN 3
			 WHEN ${hasSubstructure(column, smiles)} THEN 2
			 WHEN ${isSimilar(column, smiles)} THEN 1
			 ELSE 0
	END`;
}

export { getRelevanceScore };
