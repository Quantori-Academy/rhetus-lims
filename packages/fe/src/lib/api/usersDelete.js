export default http => ({
	async deleteUser(id) {
		return await http(`users/${id}`, {
              method: 'DELETE'
            },
			{ withCredentials: true }
		);
	},
	async getUser() {
		return await http("https://users")
	}
});


