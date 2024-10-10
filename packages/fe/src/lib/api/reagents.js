export default http => ({
	async fetchReagents() {
		return await http(`/reagents`);
	},
	async fetchSortedReagents(sort) {
		return await http(`/substances&sort=${encodeURIComponent(sort)}`);
	},
	async deleteReagent(id) {
		return await http(`/reagents/${id}`, {
			method: 'DELETE'
		});
	}
});
