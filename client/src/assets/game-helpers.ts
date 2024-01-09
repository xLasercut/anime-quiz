import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import { v4 as uuid4 } from 'uuid';
import { LocalStorageConstant } from '@/assets/types';

function getLocalStorageNumber(localStorageKey: LocalStorageConstant, defaultValue: number): number {
  try {
    const stringValue = localStorage[localStorageKey] || `${defaultValue}`;
    return parseInt(stringValue);
  } catch {
    return defaultValue;
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

function generateId(prefix: string): string {
  return `${prefix}-${uuid4()}`;
}

function canParseValue(v: any, parser: any): boolean {
  try {
    parser.parse(v);
    return true;
  } catch {
    return false;
  }
}

export { getDefaultTheme, isMatchFilter, debounce, generateId, canParseValue, getLocalStorageNumber };
