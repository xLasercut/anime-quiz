import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify, ThemeDefinition } from 'vuetify';
import { getDefaultTheme } from '@/assets/game-helpers';

const nordDark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#4c566a',
    'on-background': '#eceff4',
    surface: '#2e3440',
    'on-surface': '#eceff4',
    primary: '#81a1c1',
    'on-primary': '#2e3440',
    secondary: '#5e81ac',
    'on-secondary': '#2e3440',
    error: '#bf616a',
    'on-error': '#2e3440',
    info: '#b48ead',
    'on-info': '#2e3440',
    success: '#a3be8c',
    'on-success': '#2e3440',
    warning: '#ebcb8b',
    'on-warning': '#2e3440',
    'surface-variant': '#4c566a',
    'on-surface-variant': '#81a1c1'
  }
};

const nordLight: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#eceff4',
    'on-background': '#2e3440',
    surface: '#d8dee9',
    'on-surface': '#2e3440',
    primary: '#81a1c1',
    'on-primary': '#2e3440',
    secondary: '#5e81ac',
    'on-secondary': '#2e3440',
    error: '#bf616a',
    'on-error': '#2e3440',
    info: '#b48ead',
    'on-info': '#2e3440',
    success: '#a3be8c',
    'on-success': '#2e3440',
    warning: '#d89f47',
    'on-warning': '#2e3440',
    'surface-variant': '#eceff4',
    'on-surface-variant': '#81a1c1'
  }
};

export default createVuetify({
  theme: {
    defaultTheme: getDefaultTheme(),
    themes: {
      dark: nordDark,
      light: nordLight
    }
  }
});
