export default http => ({
	async resetUserPassword(username) {
		return await http('/request-password-reset', {
			method: 'POST',
			body: username
		});
	}
});
