export default http => ({
	async login(payload) {
		return await http('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload),
			credentials: 'include'
		});
	}
});
