import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify, ThemeDefinition } from 'vuetify';
import { getDefaultTheme } from '@/assets/game-helpers';

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
    warning: '#ebcb8b'
  }
};

const nordLight: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#ffffff',
    surface: '#d8dee9',
    primary: '#81a1c1',
    secondary: '#5e81ac',
    error: '#bf616a',
    info: '#b48ead',
    success: '#a3be8c',
    warning: '#ebcb8b'
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
