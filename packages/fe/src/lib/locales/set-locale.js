export const DEFAULT_LOCALE_KEY = 'default-locale';
export const FALLBACK_LANGUAGE = 'en';

export const setLocaleToHtml = () => {
	const savedLocale = localStorage.getItem(DEFAULT_LOCALE_KEY);
	if (savedLocale) document.documentElement.lang = savedLocale;
};

export const setLocale = (locale = FALLBACK_LANGUAGE) => {
	localStorage.setItem(DEFAULT_LOCALE_KEY, locale);
	document.documentElement.lang = locale;
};
