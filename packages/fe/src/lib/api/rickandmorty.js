export default http => ({
	async fetchCharacter(status, gender, species) {
		return (
			await http('https://rickandmortyapi.com/api/character', {
				query: { status, gender, species }
			})
		).results;
	}
});
