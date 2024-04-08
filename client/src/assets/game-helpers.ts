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
  const lowerCaseQueryText = (queryText || '').trim().toLowerCase();
  const lowerCaseItemText = (itemText || '').toLowerCase();
  for (const word of lowerCaseQueryText.split(' ')) {
    if (!lowerCaseItemText.includes(word)) {
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

function getIndexToShow(showCharacterCount: number, nameLength: number, nameSplit: string[]): Set<number> {
  const indexToShow: Set<number> = new Set();
  while (indexToShow.size < showCharacterCount) {
    const randomIndex = Math.floor(Math.random() * nameLength);
    const character = nameSplit[randomIndex];
    if (!indexToShow.has(randomIndex) && character !== ' ') {
      indexToShow.add(randomIndex);
    }
  }
  return indexToShow;
}

function getGameNameHint(originalName: string): string {
  const nameSplit = originalName.split('');
  const nameLength = nameSplit.length;

  let showCharacterCount = 4;
  if (showCharacterCount >= nameLength) {
    showCharacterCount = Math.floor(nameLength / 2);
  }

  const indexToShow = getIndexToShow(showCharacterCount, nameLength, nameSplit);

  const nameHintSplit = [];

  for (let i = 0; i < nameLength; i++) {
    if (indexToShow.has(i) || nameSplit[i] === ' ') {
      nameHintSplit.push(nameSplit[i]);
      continue;
    }

    nameHintSplit.push('_');
  }

  return nameHintSplit.join('');
}

export { getDefaultTheme, isMatchFilter, debounce, generateId, canParseValue, getLocalStorageNumber, getGameNameHint };
