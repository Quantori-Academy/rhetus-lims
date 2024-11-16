import { sql } from 'drizzle-orm';

function smilesToMol(smiles) {
	return sql`mol_from_smiles(${smiles})`;
}

export { smilesToMol };
