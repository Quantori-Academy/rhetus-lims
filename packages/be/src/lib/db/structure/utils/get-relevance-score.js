import { sql } from 'drizzle-orm';
import { isExactStructure } from './is-exact-structure.js';
import { hasSubstructure } from './has-substructure.js';
import { isSimilar } from './is-similar.js';

function getRelevanceScore(columnName, smiles) {
	return sql`
	CASE
			 WHEN ${isExactStructure(columnName, smiles)} THEN 1
			 WHEN ${hasSubstructure(columnName, smiles)} THEN 2
			 WHEN ${isSimilar(columnName, smiles)} THEN 3
			 ELSE 4
	END`;
}

export { getRelevanceScore };
