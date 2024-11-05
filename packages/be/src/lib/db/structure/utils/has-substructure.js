import { sql } from 'drizzle-orm';

function hasSubstructure(columnName, smiles) {
	return sql`${sql.raw(`${columnName}`)}@>${smiles}`;
}

export { hasSubstructure };
