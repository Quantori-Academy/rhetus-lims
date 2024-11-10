import { sql } from 'drizzle-orm';

function hasSubstructure(columnName, smiles) {
	return sql`${columnName}@>${smiles}`;
}

export { hasSubstructure };
