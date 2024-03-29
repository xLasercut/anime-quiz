import { Component } from 'vue';
import Login from '@/views/Login.vue';
import Lobby from '@/views/Lobby.vue';
import LoginPanel from '@/components/login/LoginPanel.vue';
import { DIALOG_ROUTES, ROUTES } from '@/assets/routing/routes';
import LoginSettings from '@/components/login/LoginSettings.vue';
import UserSettings from '@/views/UserSettings.vue';
import UserSettingsPanel from '@/components/user-settings/UserSettingsPanel.vue';
import SongListEdit from '@/views/SongListEdit.vue';
import SongListEditPanel from '@/components/song-list-edit/SongListEditPanel.vue';
import UserEdit from '@/views/UserEdit.vue';
import UserEditPanel from '@/components/user-edit/UserEditPanel.vue';
import UserEditDialog from '@/components/user-edit/UserEditDialog.vue';
import AnimeEdit from '@/views/AnimeEdit.vue';
import AnimeEditPanel from '@/components/anime-edit/AnimeEditPanel.vue';
import AnimeEditDialog from '@/components/anime-edit/AnimeEditDialog.vue';
import SongEdit from '@/views/SongEdit.vue';
import SongEditPanel from '@/components/song-edit/SongEditPanel.vue';
import SongEditDialog from '@/components/song-edit/SongEditDialog.vue';
import EmojiEdit from '@/views/EmojiEdit.vue';
import EmojiEditPanel from '@/components/emoji-edit/EmojiEditPanel.vue';
import EmojiEditDialog from '@/components/emoji-edit/EmojiEditDialog.vue';
import GameRoomsPanel from '@/components/game-rooms/GameRoomsPanel.vue';
import GameRooms from '@/views/GameRooms.vue';
import GameRoomsNewRoomDialog from '@/components/game-rooms/GameRoomsNewRoomDialog.vue';
import MainGame from '@/views/MainGame.vue';
import { ClientDialogRoute, ClientRoute } from '@/assets/routing/types';
import MainGamePanel from '@/components/main-game/MainGamePanel.vue';
import LobbyPanel from '@/components/lobby/LobbyPanel.vue';
import MainGameSettingsDialog from '@/components/main-game/MainGameSettingsDialog.vue';
import MainGameSongPickerDialog from '@/components/main-game/MainGameSongPickerDialog.vue';
import AdminDialog from '@/components/app/AdminDialog.vue';
import BotMessageEdit from '@/views/BotMessageEdit.vue';
import BotMessageEditPanel from '@/components/bot-message-edit/BotMessageEditPanel.vue';
import BotMessageEditDialog from '@/components/bot-message-edit/BotMessageEditDialog.vue';
import MusicPlayerPanel from '@/components/music-player/MusicPlayerPanel.vue';
import MusicPlayer from '@/views/MusicPlayer.vue';
import SongStatsEditPanel from '@/components/song-stats-edit/SongStatsEditPanel.vue';
import SongStatsEdit from '@/views/SongStatsEdit.vue';
import SongStatsEditDialog from '@/components/song-stats-edit/SongStatsEditDialog.vue';
import BulkAddSongs from '@/views/BulkAddSongs.vue';
import BulkAddSongsPanel from '@/components/bulk-add-songs/BulkAddSongsPanel.vue';

const PANEL_MAPPING: Record<ClientRoute, Component> = {
  [ROUTES.LOGIN]: LoginPanel,
  [ROUTES.LOBBY]: LobbyPanel,
  [ROUTES.USER_SETTINGS]: UserSettingsPanel,
  [ROUTES.SONG_LIST_EDIT]: SongListEditPanel,
  [ROUTES.USER_EDIT]: UserEditPanel,
  [ROUTES.ANIME_EDIT]: AnimeEditPanel,
  [ROUTES.SONG_EDIT]: SongEditPanel,
  [ROUTES.EMOJI_EDIT]: EmojiEditPanel,
  [ROUTES.GAME_ROOMS]: GameRoomsPanel,
  [ROUTES.MAIN_GAME]: MainGamePanel,
  [ROUTES.BOT_MESSAGE_EDIT]: BotMessageEditPanel,
  [ROUTES.MUSIC_PLAYER]: MusicPlayerPanel,
  [ROUTES.SONG_STATS_EDIT]: SongStatsEditPanel,
  [ROUTES.BULK_ADD_SONGS]: BulkAddSongsPanel
};

const VIEW_MAPPING: Record<ClientRoute, Component> = {
  [ROUTES.LOGIN]: Login,
  [ROUTES.LOBBY]: Lobby,
  [ROUTES.USER_SETTINGS]: UserSettings,
  [ROUTES.SONG_LIST_EDIT]: SongListEdit,
  [ROUTES.USER_EDIT]: UserEdit,
  [ROUTES.ANIME_EDIT]: AnimeEdit,
  [ROUTES.SONG_EDIT]: SongEdit,
  [ROUTES.EMOJI_EDIT]: EmojiEdit,
  [ROUTES.GAME_ROOMS]: GameRooms,
  [ROUTES.MAIN_GAME]: MainGame,
  [ROUTES.BOT_MESSAGE_EDIT]: BotMessageEdit,
  [ROUTES.MUSIC_PLAYER]: MusicPlayer,
  [ROUTES.SONG_STATS_EDIT]: SongStatsEdit,
  [ROUTES.BULK_ADD_SONGS]: BulkAddSongs
};

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
  [DIALOG_ROUTES.SONG_STATS_EDIT]: SongStatsEditDialog
};

export { VIEW_MAPPING, PANEL_MAPPING, DIALOG_MAPPINGS };
