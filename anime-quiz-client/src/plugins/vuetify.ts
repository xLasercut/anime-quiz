import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
      options: {
        customProperties: true,
      },
    themes: {
      light: {
        primary: '#81a1c1',
        secondary: '#5e81ac',
        accent: '#8fbcbb',
        error: '#bf616a',
        info: '#b48ead',
        success: '#a3be8c',
        warning: '#d08770',
        background: {
          base: '#ffffff',
          darken1: '#e5e9f0',
          darken2: '#d8dee9',
          darken3: '#d8dee9'
        }
      },
      dark: {
        background: {
          base: '#4c566a',
          darken1: '#434c5e',
          darken2: '#3b4252',
          darken3: '#2e3440'
        },
        primary: '#81a1c1',
        secondary: '#5e81ac',
        accent: '#8fbcbb',
        error: '#bf616a',
        info: '#b48ead',
        success: '#a3be8c',
        warning: '#d08770'
      }
    },
  },
});
