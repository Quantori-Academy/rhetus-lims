export default http => ({
	async fetchReagents() {
		return await http(`/reagents`);
	},
	async fetchSortedReagents(params) {
		return await http(`/substances`, { query: params });
	},
	async deleteReagent(id) {
		return await http(`/reagents/${id}`, {
			method: 'DELETE'
		});
	}
});
