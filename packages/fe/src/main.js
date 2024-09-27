import './lib/assets/stylesheets/main.css';

import { createApp } from 'vue';
import App from './app.vue';
import { router } from './lib/router/router';
import { startWorker } from '../spec/mocks/browser/browser';
import { env } from './env';
import { ElLoading } from 'element-plus';

if (process.env.NODE_ENV === 'development') startWorker();

const app = createApp(App);

app.use(router);
app.directive('loading', ElLoading.directive);

app.mount('#app');
