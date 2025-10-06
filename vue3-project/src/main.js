import './assets/main.css'

import { createApp } from 'vue'
// 引入路由器
import router from './router/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount('#app');
