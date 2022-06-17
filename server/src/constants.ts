const ROOM_NAME_PREFIX = 'ANIME_QUIZ';

const ROOM_IDS = {
  SONG_LIST: 'SONG_LIST',
  ANIME_EDIT: 'ANIME_EDIT',
  SONG_EDIT: 'SONG_EDIT',
  EMOJI_EDIT: 'EMOJI_EDIT',
  USER_EDIT: 'USER_EDIT'
};

const SANITIZE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\\/': '&sol;',
  "'": '&apos;'
};

export { ROOM_NAME_PREFIX, SANITIZE_MAP, ROOM_IDS };
