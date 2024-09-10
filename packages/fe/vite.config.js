import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import ElementPlus from 'unplugin-element-plus/vite';
import { svgSpritemap } from 'vite-plugin-svg-spritemap';
import { resolve } from 'node:path';

export default defineConfig({
	resolve: {
		alias: { '~/lib': resolve(import.meta.dirname, 'src/lib') }
	},
	plugins: [
		vue(),
		vueDevTools(),
		ElementPlus(),
		svgSpritemap({
			pattern: 'icons/*.svg'
		})
	]
});
