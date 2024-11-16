import { sql } from 'drizzle-orm';

function isValidSmilesQuery(smiles) {
	return sql`SELECT is_valid_smiles(${smiles}) AS is_valid`;
}

export { isValidSmilesQuery };
