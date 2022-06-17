import Vue from 'vue';
import App from './App.vue';
import { store } from './plugins/store';
import vuetify from './plugins/vuetify';
import VueCompositionAPI from '@vue/composition-api';
import VueYoutubeEmbed from 'vue-youtube-embed';

Vue.config.productionTip = false;

Vue.use(VueCompositionAPI);
Vue.use(VueYoutubeEmbed);

new Vue({
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
