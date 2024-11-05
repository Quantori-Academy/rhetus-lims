export default http => ({
	async deleteReagent(id) {
		return await http(`/reagents/${id}`, {
			method: 'DELETE'
		});
	},
	async fetchReagent(id) {
		return await http(`/reagents/${id}`);
	},
	async updateReagent(id, item) {
		return await http(`/reagents/${id}`, {
			method: 'PUT',
			body: JSON.stringify(item)
		});
	},
	async addReagent(reagent) {
		return await http('/reagents', {
			method: 'POST',
			body: reagent
		});
	}
});
