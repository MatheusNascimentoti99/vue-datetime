import { createApp } from 'vue';

import createDatetime from '../../src';

import DemoApp from './views/DemoApp.vue';

import './app.css';

const app = createApp(DemoApp);
app.use(createDatetime());

app.mount('#app');
