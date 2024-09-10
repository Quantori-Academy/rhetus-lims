export function getConfig() {
	const config = {
		mode: import.meta.env.MODE,
		prod: import.meta.env.PROD,
		dev: import.meta.env.DEV,
		api: {
			url: import.meta.env.VITE_API_URL
		},
		msw: {
			browser: import.meta.env.VITE_MSW_BROWSER === 'true'
		}
	};

	return config;
}

export const env = getConfig();
