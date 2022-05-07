import 'vuetify/styles'
import '@fortawesome/fontawesome-free/js/all.js'
import {createVuetify, ThemeDefinition} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const nordDark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#4c566a',
    surface: '#2e3440',
    primary: '#81a1c1',
    secondary: '#5e81ac',
    error: '#bf616a',
    info: '#b48ead',
    success: '#a3be8c',
    warning: '#d08770',
    'on-background': '#eceff4',
    'on-surface': '#eceff4',
    'on-primary': '#eceff4',
    'on-secondary': '#eceff4',
    'on-error': '#eceff4',
    'on-info': '#eceff4',
    'on-success': '#eceff4',
    'on-warning': '#eceff4',
  }
}

const nordLight: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#eceff4',
    surface: '#d8dee9',
    primary: '#81a1c1',
    secondary: '#5e81ac',
    error: '#bf616a',
    info: '#b48ead',
    success: '#a3be8c',
    warning: '#d08770',
    'on-background': '#2e3440',
    'on-surface': '#2e3440',
    'on-primary': '#eceff4',
    'on-secondary': '#eceff4',
    'on-error': '#eceff4',
    'on-info': '#eceff4',
    'on-success': '#eceff4',
    'on-warning': '#eceff4',
  }
}

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'nordDark',
    themes: {
      nordDark,
      nordLight
    }
  },
  components,
  directives
})

export {vuetify}
