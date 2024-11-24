import Jed from 'jed';
import { translations } from '../../../../../translations';
import sprintf from './sprintf.js';
import { ensureSingleLine } from './ensure-single-line.js';
import { FALLBACK_LANGUAGE } from './set-locale.js';

const languageCode = () => document.querySelector('html').getAttribute('lang') || FALLBACK_LANGUAGE;

/**
 * This file might be imported into a web worker indirectly, the `window` object
 * won't be defined in the web worker context so we need to check if it is defined
 * before we access the `translations` property.
 */
const hasTranslations = translations[languageCode()];
const locale = new Jed(hasTranslations ? { locale_data: translations[languageCode()] } : {});

/**
 * Translates `text`.
 * @param {string} text - The text to be translated
 * @returns {string} The translated text
 */
const gettext = text => locale.gettext(ensureSingleLine(text));

/**
 * Translate the text with a number.
 *
 * If the number is more than 1 it will use the `pluralText` translation.
 * This method allows for contexts, see below re. contexts
 * @param {string} text - Singular text to translate (e.g. '%d day')
 * @param {string} pluralText - Plural text to translate (e.g. '%d days')
 * @param {number} count - Number to decide which translation to use (e.g. 2)
 * @returns {string} Translated text with the number replaced (e.g. '2 days')
 */
const ngettext = (text, pluralText, count) => {
	const translated = locale
		.ngettext(ensureSingleLine(text), ensureSingleLine(pluralText), count)
		.replace(/%d/g, count)
		.split('|');

	return translated[translated.length - 1];
};

/**
 * Translate context based text.
 * @example
 * s__('Context|Text to translate');
 * @example
 * s__('Context', 'Text to translate');
 * @param {string} keyOrContext - Context and a key to translation (e.g. 'Context|Text')
 * or just a context (e.g. 'Context')
 * @param {string} [key] - if `keyOrContext` is just a context, this is the key to translation
 * @returns {string} Translated context based text
 */
const pgettext = (keyOrContext, key) => {
	const normalizedKey = ensureSingleLine(key ? `${keyOrContext}|${key}` : keyOrContext);
	const translated = gettext(normalizedKey).split('|');

	return translated[translated.length - 1];
};

export { languageCode };
export { gettext as __ };
export { ngettext as n__ };
export { pgettext as s__ };
export { sprintf };
export default locale;
