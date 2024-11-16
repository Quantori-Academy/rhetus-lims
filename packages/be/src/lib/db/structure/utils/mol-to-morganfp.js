import { sql } from 'drizzle-orm';

function molToMoraganFP(mol) {
	return sql`morganbv_fp(${mol})`;
}

export { molToMoraganFP };
