import { loadFonts } from './webfontloader';
import vuetify from './vuetify';
import type { App } from 'vue';
import { pinia } from '@/plugins/store';
import '@vime/core/themes/default.css';

export function registerPlugins(app: App) {
  loadFonts();
  app.use(vuetify);
  app.use(pinia);
}
