export default http => ({
	async fetchStorages(params) {
		return await http('/storages', { query: params });
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
