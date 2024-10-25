export default http => ({
	async fetchSubstances(params) {
		return await http(`/substances`, { query: params });
	},
	async updateSubstance(id, item) {
		return await http(`/substances/${id}`, {
			method: 'PATCH',
			body: item
		});
	}
});
