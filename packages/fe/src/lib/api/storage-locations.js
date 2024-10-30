export default http => ({
	async fetchStorages(sort, params) {
		return await http('/storages', { query: { options: params, sort } });
	},
	async fetchStorage(id) {
		return await http(`/storages/${id}`);
	},
	async addStorage(storage) {
		return await http('/storages', {
			method: 'POST',
			body: storage
		});
	},
	async updateStorage(id, storage) {
		return await http(`/storages/${id}`, {
			method: 'PATCH',
			body: storage
		});
	},
	async deleteStorage(id) {
		return await http(`/storages/${id}`, {
			method: 'DELETE'
		});
	}
});
