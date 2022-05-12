import Vue from 'vue'
import App from './App.vue'
import { store } from './plugins/store'
import vuetify from './plugins/vuetify'
import VueCompositionAPI from '@vue/composition-api'

Vue.config.productionTip = false

Vue.use(VueCompositionAPI)

new Vue({
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
