import 'vuetify/styles'
import '@fortawesome/fontawesome-free/js/all.js'
import {createVuetify, ThemeDefinition} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const nordDark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#3b4252',
    surface: '#2e3440',
    primary: '#81a1c1',
    secondary: '#5e81ac',
    error: '#bf616a',
    info: '#b48ead',
    success: '#a3be8c',
    warning: '#d08770',
    'on-background': '#eceff4',
    'on-surface': '#eceff4',
    'on-primary': '#2e3440',
    'on-secondary': '#2e3440',
    'on-error': '#2e3440',
    'on-info': '#2e3440',
    'on-success': '#2e3440',
    'on-warning': '#2e3440',
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
    'on-primary': '#2e3440',
    'on-secondary': '#2e3440',
    'on-error': '#2e3440',
    'on-info': '#2e3440',
    'on-success': '#2e3440',
    'on-warning': '#2e3440',
  }
}

const oneDark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#1e2127',
    surface: '#1e2127',
    primary: '#61afef',
    secondary: '#5e81ac',
    error: '#e06c75',
    info: '#56b6c2',
    success: '#98c379',
    warning: '#d19a66',
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

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'nordDark',
    themes: {
      nordDark,
      nordLight,
      oneDark
    }
  },
  components,
  directives
})

export {vuetify}
