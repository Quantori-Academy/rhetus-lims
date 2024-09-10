import { order } from './prettier.order.js';
/** @type {import('prettier').Config} */
export default {
	plugins: ['prettier-plugin-css-order'],
	cssDeclarationSorterCustomOrder: order,
	overrides: [{ files: ['*.vue'], options: { parser: 'vue' } }],
	arrowParens: 'avoid',
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100
};
