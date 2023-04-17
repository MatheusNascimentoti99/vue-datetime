import { createApp } from 'vue';

import createDatetime from 'vue-datetime3';

import DemoApp from './views/DemoApp.vue';

import './app.css';
import 'vue-datetime3/style.css';

const app = createApp(DemoApp);
app.use(createDatetime());

app.mount('#app');
