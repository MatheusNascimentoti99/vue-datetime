import { createApp, defineComponent } from 'vue'
// import Datetime from '../../dist/vue-datetime'
import DemoApp from './components/DemoApp';

import '../../dist/vue-datetime.css'
import './app.css'

const app = createApp(defineComponent(DemoApp));

// app.use(Datetime)

app.mount('#app')
