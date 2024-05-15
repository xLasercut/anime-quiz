import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useClientStore } from '@/plugins/store/client';
import { pinia } from '@/plugins/store';
import { ROUTER_VIEWS, ROUTES } from '@/plugins/router/constants';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { GameRoomId } from 'anime-quiz-shared-resources/src/models/game';
import { useGameStore } from '@/plugins/store/game';

const clientStore = useClientStore(pinia);
const gameStore = useGameStore(pinia);

const routes: RouteRecordRaw[] = [
  {
    path: ROUTES.LOGIN,
    name: 'Login',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/Login.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/login/LoginPanel.vue')
    }
  },
  {
    path: ROUTES.LOBBY,
    name: 'Lobby',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/Lobby.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/lobby/LobbyPanel.vue')
    }
  },
  {
    path: ROUTES.USER_SETTINGS,
    name: 'User Settings',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/UserSettings.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/user-settings/UserSettingsPanel.vue')
    }
  },
  {
    path: ROUTES.MUSIC_PLAYER,
    name: 'Music Player',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/MusicPlayer.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/music-player/MusicPlayerPanel.vue')
    }
  },
  {
    path: ROUTES.SONG_STATS_EDIT,
    name: 'Song Stats',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/SongStatsEdit.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/song-stats-edit/SongStatsEditPanel.vue')
    }
  },
  {
    path: ROUTES.ANIME_EDIT,
    name: 'Anime Edit',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/AnimeEdit.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/anime-edit/AnimeEditPanel.vue')
    }
  },
  {
    path: ROUTES.SONG_LIST_EDIT,
    name: 'Song List',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/SongListEdit.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/song-list-edit/SongListEditPanel.vue')
    }
  },
  {
    path: ROUTES.GAME_ROOMS,
    name: 'Game Rooms',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/GameRooms.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/game-rooms/GameRoomsPanel.vue')
    }
  },
  {
    path: ROUTES.SONG_EDIT,
    name: 'Song Edit',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/SongEdit.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/song-edit/SongEditPanel.vue')
    }
  },
  {
    path: ROUTES.EMOJI_EDIT,
    name: 'Emoji Edit',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/EmojiEdit.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/emoji-edit/EmojiEditPanel.vue')
    }
  },
  {
    path: ROUTES.BOT_MESSAGE_EDIT,
    name: 'Bot Message Edit',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/BotMessageEdit.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/bot-message-edit/BotMessageEditPanel.vue')
    }
  },
  {
    path: ROUTES.USER_EDIT,
    name: 'User Edit',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/UserEdit.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/user-edit/UserEditPanel.vue')
    }
  },
  {
    path: ROUTES.BULK_ADD_SONGS,
    name: 'Bulk Add Songs',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/BulkAddSongs.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/bulk-add-songs/BulkAddSongsPanel.vue')
    }
  },
  {
    path: ROUTES.MAIN_GAME(':id'),
    name: 'Game',
    components: {
      [ROUTER_VIEWS.DEFAULT]: () => import('@/views/MainGame.vue'),
      [ROUTER_VIEWS.NAV_BAR]: () => import('@/components/main-game/MainGamePanel.vue')
    }
  }
];

const ADMIN_ROUTES: string[] = [
  ROUTES.ANIME_EDIT,
  ROUTES.SONG_EDIT,
  ROUTES.EMOJI_EDIT,
  ROUTES.BOT_MESSAGE_EDIT,
  ROUTES.USER_EDIT,
  ROUTES.BULK_ADD_SONGS
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

router.beforeEach(async (to, from) => {
  if (!clientStore.clientData.auth && to.path !== ROUTES.LOGIN) {
    return { path: ROUTES.LOGIN, replace: true };
  }

  if (!clientStore.clientData.admin && ADMIN_ROUTES.includes(to.path)) {
    socket.disconnect();
    return { path: ROUTES.LOGIN, replace: true };
  }

  if (from.path.includes(ROUTES.MAIN_GAME('')) && gameStore.playing) {
    if (!confirm('Are you sure you want to exit the game?')) {
      return false;
    }
  }

  if (from.path.includes(ROUTES.MAIN_GAME(''))) {
    socket.emit(SOCKET_EVENTS.LEAVE_ALL_ROOMS);
  }

  if (to.path.includes(ROUTES.MAIN_GAME(''))) {
    const roomId = GameRoomId.parse(to.params.id);
    socket.emit(SOCKET_EVENTS.JOIN_GAME_ROOM, roomId, (success: boolean) => {
      if (success) {
        router.push(ROUTES.MAIN_GAME(roomId));
        return;
      }

      router.push(ROUTES.GAME_ROOMS);
    });
  }
});

export { router };
