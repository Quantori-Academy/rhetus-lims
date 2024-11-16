import { sql } from 'drizzle-orm';

function isExactStructure(columnName, smiles) {
	return sql`${columnName}@=${smiles}`;
}

export { isExactStructure };
