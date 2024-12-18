import './lib/assets/stylesheets/main.css';

import { createApp } from 'vue';
import App from './app.vue';
import { setLocaleToHtml } from './lib/locales/set-locale.js';
import { $router } from './lib/router/router';
import { startWorker } from '../spec/mocks/browser/browser';
import { env } from './env';
import { ElLoading } from 'element-plus';

if (env.msw.browser) startWorker();

setLocaleToHtml();

const app = createApp(App);

app.use($router);
app.directive('loading', ElLoading.directive);

app.mount('#app');
