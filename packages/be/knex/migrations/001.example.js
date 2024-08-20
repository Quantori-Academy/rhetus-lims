/** @param {import('knex').Knex} knex */
export async function up(knex) {
	await knex.schema.createTable('users', table => {
		table.increments('id').primary();
		table.string('name').notNullable();
		table.string('email').unique().notNullable();
		table.timestamps(true, true);
	});
}

/** @param {import('knex').Knex} knex */
export async function down(knex) {
	await knex.schema.dropTableIfExists('users');
}
