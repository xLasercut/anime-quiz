import { Component } from 'vue';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import LoginSettings from '@/components/login/LoginSettings.vue';
import UserEditDialog from '@/components/user-edit/UserEditDialog.vue';
import AnimeEditDialog from '@/components/anime-edit/AnimeEditDialog.vue';
import SongEditDialog from '@/components/song-edit/SongEditDialog.vue';
import EmojiEditDialog from '@/components/emoji-edit/EmojiEditDialog.vue';
import GameRoomsNewRoomDialog from '@/components/game-rooms/GameRoomsNewRoomDialog.vue';
import { ClientDialogRoute } from '@/assets/routing/types';
import MainGameSettingsDialog from '@/components/main-game/MainGameSettingsDialog.vue';
import MainGameSongPickerDialog from '@/components/main-game/MainGameSongPickerDialog.vue';
import AdminDialog from '@/components/app/AdminDialog.vue';
import BotMessageEditDialog from '@/components/bot-message-edit/BotMessageEditDialog.vue';
import SongStatsEditDialog from '@/components/song-stats-edit/SongStatsEditDialog.vue';
import VideoPlayerDialog from '@/components/common/VideoPlayerDialog.vue';

const DIALOG_MAPPINGS: Record<ClientDialogRoute, Component> = {
  [DIALOG_ROUTES.LOGIN_SETTINGS]: LoginSettings,
  [DIALOG_ROUTES.USER_EDIT]: UserEditDialog,
  [DIALOG_ROUTES.ANIME_EDIT]: AnimeEditDialog,
  [DIALOG_ROUTES.SONG_EDIT]: SongEditDialog,
  [DIALOG_ROUTES.EMOJI_EDIT]: EmojiEditDialog,
  [DIALOG_ROUTES.NEW_GAME_ROOM]: GameRoomsNewRoomDialog,
  [DIALOG_ROUTES.MAIN_GAME_SETTINGS]: MainGameSettingsDialog,
  [DIALOG_ROUTES.MAIN_GAME_SONG_PICKER]: MainGameSongPickerDialog,
  [DIALOG_ROUTES.ADMIN_PANEL]: AdminDialog,
  [DIALOG_ROUTES.BOT_MESSAGE_EDIT]: BotMessageEditDialog,
  [DIALOG_ROUTES.SONG_STATS_EDIT]: SongStatsEditDialog,
  [DIALOG_ROUTES.VIDEO_PLAYER]: VideoPlayerDialog
};

export { DIALOG_MAPPINGS };
