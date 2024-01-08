import { loadFonts } from './webfontloader';
import vuetify from './vuetify';
import type { App } from 'vue';
import { pinia } from '@/plugins/store';
import 'vidstack/player/styles/default/theme.css';
import 'vidstack/player/styles/default/layouts/video.css';
import 'vidstack/player';
import 'vidstack/player/layouts';
import 'vidstack/player/ui';

export function registerPlugins(app: App) {
  loadFonts();
  app.use(vuetify);
  app.use(pinia);
}
