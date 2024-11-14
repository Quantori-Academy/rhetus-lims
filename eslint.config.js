import globals from 'globals';
import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';

export default [
	{ ignores: ['**/dist', '.github', 'node_modules', 'scripts', 'packages/auto-mention-action', 'packages/fe/src/lib/router/routes.js'] },
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	js.configs.recommended,
	...vue.configs['flat/recommended'],
	{
		rules: {
			complexity: ['error', { max: 6 }],
			'max-depth': ['error', { max: 2 }],
			'max-nested-callbacks': ['error', { max: 2 }],
			'max-params': ['error', { max: 4 }],
			'max-lines': ['error', { max: 250, skipComments: true, skipBlankLines: true }]
		}
	},
	{
		files: ['packages/fe/**/*.vue'],
		rules: {
			'vue/component-tags-order': [
				'error',
				{
					order: ['script', 'template', 'style']
				}
			],
			'vue/component-name-in-template-casing': [
				'error',
				'kebab-case',
				{ registeredComponentsOnly: true }
			],
			'vue/no-reserved-component-names': 'error',
			'vue/component-api-style': ['error', ['script-setup']],
			'vue/custom-event-name-casing': ['error', 'kebab-case'],
			'vue/no-boolean-default': ['error', 'default-false'],
			'vue/no-static-inline-styles': [
				'error',
				{
					allowBinding: false
				}
			],
			'vue/no-undef-components': [
				'error',
				{ ignorePatterns: ['router-link', 'router-view', '^el-[a-z]'] }
			],
			'vue/no-lone-template': [
				'error',
				{
					ignoreAccessible: false
				}
			],
			'vue/no-useless-v-bind': [
				'error',
				{
					ignoreIncludesComment: false,
					ignoreStringEscape: false
				}
			],
			'vue/padding-line-between-blocks': ['error', 'always'],
			'vue/v-for-delimiter-style': ['error', 'of'],
			'vue/v-on-event-hyphenation': [
				'error',
				'always',
				{
					autofix: true
				}
			],
			'vue/v-on-handler-style': 'error'
		}
	},
	{
		files: ['packages/be/src/services/orders/orders-service.js'],
		rules: {
			'max-lines': ['error', { max: 300, skipComments: true, skipBlankLines: true }]
		}
	},
	prettier,
	{ rules: { 'prettier/prettier': 'off' } }
];
