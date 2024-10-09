export default http => ({
	async fetchReagents() {
		return await http(`/reagents`);
	},
	async deleteReagent(id) {
		return await http(`/reagents/${id}`, {
			method: 'DELETE'
		});
	}
});
