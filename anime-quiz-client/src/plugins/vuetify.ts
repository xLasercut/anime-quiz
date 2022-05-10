import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import {createVuetify, ThemeDefinition} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const discordDark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#36393f',
    surface: '#292b2f',
    primary: '#7289da',
    secondary: '#7289da',
    error: '#f04740',
    info: '#8e9297',
    success: '#3fb581',
    warning: '#faa61a'
  }
}

const discordLight: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#ffffff',
    surface: '#e3e5e8',
    primary: '#7289da',
    secondary: '#7289da',
    error: '#f04740',
    info: '#8e9297',
    success: '#3fb581',
    warning: '#faa61a'
  }
}

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

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },
  theme: {
    defaultTheme: 'nordDark',
    themes: {
      nordDark,
      nordLight,
      discordDark,
      discordLight
    }
  },
  components,
  directives
})

export {vuetify}
