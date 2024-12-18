import globals from 'globals';
import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';

export default [
	{
		ignores: [
			'**/dist',
			'.github',
			'node_modules',
			'scripts',
			'packages/auto-mention-action',
			'packages/fe/src/lib/router/routes.js',
			'packages/fe/public/ketcher',
			'packages/fe/src/orders/details/order-details.vue',
			'packages/fe/src/orders/new/add-new-order.vue',
			'packages/fe/src/requests/request-details.vue',
			'packages/fe/src/substances/reagents/reagent-details.vue',
			'packages/fe/src/substances/samples/edit/edit-sample.vue'
		]
	},
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
		files: [
			'packages/be/src/services/requests/requests-service.js',
			'packages/be/src/services/orders/orders-service.js',
			'packages/be/src/services/reagents/reagents-service.js',
			'packages/be/src/services/samples/samples-service.js',
			'packages/be/src/routes/orders/orders-route.js',
			'packages/be/src/services/order-items/order-items-service.js'
		],
		rules: {
			'max-lines': ['error', { max: 400, skipComments: true, skipBlankLines: true }]
		}
	},
	prettier,
	{ rules: { 'prettier/prettier': 'off' } }
];
