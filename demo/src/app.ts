import { createApp } from 'vue';

import createDatetime from '../../src';

import DemoApp from './views/DemoApp.vue';

import '../../dist/vue-datetime.css';
import './app.css';

const app = createApp(DemoApp);
app.use(createDatetime());

app.mount('#app');
