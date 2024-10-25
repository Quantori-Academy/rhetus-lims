export default http => ({
	async fetchReagents(sort, params) {
		return await http(`/reagents`, { query: { options: params, sort } });
	},
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
	},
	async changeSubstanceQuantity(id, body) {
		return await http(`/substances/quantity-change/${id}`, {
			method: 'PUT',
			body
		});
	}
});
