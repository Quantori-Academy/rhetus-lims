import { sql } from 'drizzle-orm';
import { molToMoraganFP } from './mol-to-morganfp.js';
import { smilesToMol } from './smiles-to-mol.js';

function isSimilar(columnName, smiles) {
	return sql`${molToMoraganFP(sql.raw(`${columnName}`))} % ${molToMoraganFP(smilesToMol(smiles))}`;
}

export { isSimilar };
