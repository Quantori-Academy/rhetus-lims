export default http => ({
	async fetchSubstances(params) {
		return await http(`/substances`, { query: params });
	},
	async fetchSubstance(category, id) {
		return await http(`/substances/${category}/${id}`);
	},
	async deleteSubstance(category, id) {
		return await http(`/substances/${category}/${id}`, {
			method: 'DELETE'
		});
	},
	async addSubstance(substance) {
		return await http(`/substances`, {
			method: 'POST',
			body: substance
		});
	},
	async updateSubstance(id, item) {
		return await http(`/substances/${id}`, {
			method: 'PATCH',
			body: item
		});
	},
	async changeSubstanceQuantity(id, body) {
		return await http(`/substances/quantity-change/${id}`, {
			method: 'PUT',
			body
		});
	}
});
