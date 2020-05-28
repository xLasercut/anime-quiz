import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        warning: '#faa61a',
        success: '#3fb581',
        error: '#f04740',
        primary: '#7289da',
        background: {
          base: '#ffffff',
          darken1: '#f2f3f5',
          darken2: '#fafafa',
          darken3: '#e3e5e8'
        },
        info: '#8e9297',
        accent: '#7289da'
      },
      dark: {
        warning: '#faa61a',
        success: '#3fb581',
        error: '#f04740',
        primary: '#7289da',
        background: {
          base: '#36393f',
          darken1: '#2f3136',
          darken2: '#292b2f',
          darken3: '#202225'
        },
        info: '#8e9297',
        accent: '#7289da'
      }
    }
  },
})
