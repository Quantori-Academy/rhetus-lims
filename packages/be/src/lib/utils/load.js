export async function load(modulePath, knex) {
	const module = await import(modulePath);

	return module.default(knex);
}
