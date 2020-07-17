import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueCompositionApi from '@vue/composition-api'
import VueYoutubeEmbed from 'vue-youtube-embed'

Vue.config.productionTip = false

Vue.use(VueCompositionApi)
Vue.use(VueYoutubeEmbed)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
