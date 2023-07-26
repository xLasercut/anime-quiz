import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import { inject, InjectionKey } from 'vue';

function getDefaultVolume(): number {
  try {
    return parseInt(localStorage[LOCAL_STORAGE_CONSTANTS.AQ_VOLUME]);
  } catch {
    return 50;
  }
}

function isDarkTheme(): boolean {
  return localStorage[LOCAL_STORAGE_CONSTANTS.DARK_THEME] === 'true';
}

function getDefaultTheme(): string {
  if (isDarkTheme()) {
    return 'dark';
  }
  return 'light';
}

function injectStrict<T>(key: string): T {
  const resolved = inject<T>(key);
  if (!resolved) {
    throw new Error(`Could not resolve ${key}`);
  }
  return resolved;
}

export { getDefaultVolume, getDefaultTheme, injectStrict };
