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

function isMatchFilter(queryText: string | null, itemText: string | null): boolean {
  for (const word of (queryText || '').split(' ')) {
    if (!(itemText || '').toLowerCase().includes(word.toLowerCase())) {
      return false;
    }
  }
  return true;
}

function debounce(f: Function, delay: number): Function {
  let inDebounce: NodeJS.Timeout;
  return function (this: ThisParameterType<Function>) {
    clearTimeout(inDebounce);
    inDebounce = setTimeout((): void => {
      f.apply(this, arguments);
    }, delay);
  };
}

export { getDefaultVolume, getDefaultTheme, injectStrict, isMatchFilter, debounce };
