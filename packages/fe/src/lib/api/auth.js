export default http => ({
	async login(payload) {
		return await http('/login', {
			method: 'POST',
			body: JSON.stringify(payload)
		});
	},
	async resetUserPassword(username) {
		return await http('/request-password-reset', {
			method: 'POST',
			body: username
		});
	}
});
