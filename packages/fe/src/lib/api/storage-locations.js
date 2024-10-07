export default http => ({
    async fetchStorages() {
        return await http('/storages');
    },
    async fetchStorage(id) {
        return await http(`/storages/${id}`)
    },
    async updateStorage(id, storage) {
        return await http(`/storages/${id}`, {
            method: 'PUT',
            body: storage
        })
    },
    async deleteStorage(id) {
		return await http(`/storages/${id}`, {
			method: 'DELETE'
		});
	}
})