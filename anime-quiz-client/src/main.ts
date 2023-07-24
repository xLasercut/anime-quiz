import App from './App.vue'
import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import {router} from "@/plugins/router";

const app = createApp(App)

registerPlugins(app)

app.use(router).mount('#app')
