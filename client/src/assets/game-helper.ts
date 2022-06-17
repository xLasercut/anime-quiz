import { LOCAL_STORAGE_CONSTANTS } from './constants';

function calculateStartPosition(
  startPosition: number,
  guessTime: number,
  duration: number
): number {
  const maxStart = Math.floor(duration - guessTime);
  if (maxStart > 0) {
    return Math.floor(startPosition * maxStart);
  }
  return 0;
}

function getDefaultVolume(): number {
  try {
    return parseInt(localStorage[LOCAL_STORAGE_CONSTANTS.AQ_VOLUME]);
  } catch {
    return 50;
  }
}

function isYoutubeVideo(src: string): boolean {
  return src.includes('youtube');
}

function shouldDisplayResult(queryText: string, itemText: string): boolean {
  for (const word of queryText.split(' ')) {
    if (!itemText.toLowerCase().includes(word.toLowerCase())) {
      return false;
    }
  }
  return true;
}

export { calculateStartPosition, shouldDisplayResult, getDefaultVolume, isYoutubeVideo };
