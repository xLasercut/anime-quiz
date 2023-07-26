import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';

function getDefaultVolume(): number {
  try {
    return parseInt(localStorage[LOCAL_STORAGE_CONSTANTS.AQ_VOLUME]);
  } catch {
    return 50;
  }
}

function isDarkTheme(): boolean {
  return localStorage[LOCAL_STORAGE_CONSTANTS.DARK_THEME] === 'true'
}

function getDefaultTheme(): string {
  if (isDarkTheme()) {
    return 'dark'
  }
  return 'light'
}

export { getDefaultVolume, getDefaultTheme };
