const ROUTES = {
  LOGIN: '/login',
  USER_SETTINGS: '/user-settings',
  LOBBY: '/lobby',
  MUSIC_PLAYER: '/music-player',
  SONG_STATS_EDIT: '/song-stats',
  ANIME_EDIT: '/anime-edit',
  SONG_EDIT: '/song-edit',
  EMOJI_EDIT: '/emoji-edit',
  USER_EDIT: '/user-edit',
  BOT_MESSAGE_EDIT: '/bot-message-edit',
  SONG_LIST_EDIT: '/song-list',
  GAME_ROOMS: '/game-rooms',
  MAIN_GAME: (id: string): string => {
    return `/game/${id}`;
  },
  BULK_ADD_SONGS: '/bulk-add-songs'
} as const;

const ROUTER_VIEWS = {
  DEFAULT: 'default',
  NAV_BAR: 'nav-bar'
} as const;

export { ROUTES, ROUTER_VIEWS };
