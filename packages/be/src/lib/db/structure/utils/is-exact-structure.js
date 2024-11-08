import { sql } from 'drizzle-orm';

function isExactStructure(columnName, smiles) {
	return sql`${sql.raw(`${columnName}`)}@=${smiles}`;
}

export { isExactStructure };
