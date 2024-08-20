import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'node:path';

export default defineConfig({
	resolve: {
		alias: { '~/lib': resolve(import.meta.dirname, 'src/lib') }
	},
	plugins: [
		vue(),
		vueDevTools(),
		AutoImport({ resolvers: [ElementPlusResolver()] }),
		Components({ resolvers: [ElementPlusResolver()] })
	]
});
