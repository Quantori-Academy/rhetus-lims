export default http => ({
	async fetchCity(id) {
		return await http(`cities/${id}`);
	}
});
