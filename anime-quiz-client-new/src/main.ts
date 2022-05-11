import { createApp } from 'vue'
import App from './App.vue'
import {store} from './plugins/store'
// Import icon libraries
import '@quasar/extras/mdi-v6/mdi-v6.css'
// Import Quasar css
import 'quasar/src/css/index.sass'
import { Quasar } from 'quasar'
import quasarLang from 'quasar/lang/en-GB'

const app = createApp(App)
app.use(Quasar, {
  plugins: {},
  lang: quasarLang
})
app.use(store)
app.mount('#app')
