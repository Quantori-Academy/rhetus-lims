export default http => ({
	async getBearerToken(username, password) {
		const url = 'https://endpoint';
    	const payload = {
        	username: username,
        	password: password
    	};
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});
	
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
	
			const data = await response.json();
			if (!data.token) {
				throw new Error("No token received");
			}
	
			return data.token;
		} catch (error) {
			console.error("Error fetching token:", error);
			return null;
		}
	},
	async fetchUser(token, username) {
		const url = `https://endpoint/${username}`;
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("Error fetching user data:", error);
			return null;
		}
	}
});