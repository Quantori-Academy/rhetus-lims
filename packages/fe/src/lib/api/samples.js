export default http => ({
	async fetchSample(id) {
		return await http(`/samples/${id}`);
	},
	async addSample(sample) {
		return await http('/samples', {
			method: 'POST',
			body: sample
		});
	},
	async updateSample(id, sample) {
		return await http(`/samples/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(sample)
		});
	},
	async deleteSample(id) {
		return await http(`/samples/${id}`, {
			method: 'DELETE'
		});
	}
});
