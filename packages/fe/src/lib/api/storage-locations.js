export default http => ({
    async fetchStorages() {
        return await http('/storages');
    },
    async fetchStorage(id) {
        return await http(`/storages/${id}`)
    }
})