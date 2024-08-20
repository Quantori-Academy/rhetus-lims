import 'element-plus/dist/index.css';
import 'primeicons/primeicons.css';

import './lib/assets/stylesheets/main.css';

import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from './app.vue';
import { router } from './lib/router/router';
import { startWorker } from '../spec/mocks/browser/browser';
import { env } from './env';

if (env.msw.browser) startWorker();

const app = createApp(App);

app.use(router);
app.use(ElementPlus);

app.mount('#app');
