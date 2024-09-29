export default http => ({
	async resetUserPassword (username) {
		return await http('/endpoint', {
			method: 'POST',
			body: username
		});
	}
});
