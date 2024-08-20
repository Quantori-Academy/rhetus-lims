export function getConfig() {
	const config = {
		mode: import.meta.env.MODE,
		prod: import.meta.env.PROD,
		dev: import.meta.env.DEV,
		api: {
			url: import.meta.env.API_URL
		},
		msw: {
			browser: import.meta.env.MSW_BROWSER
		}
	};

	return config;
}

export const env = getConfig();
