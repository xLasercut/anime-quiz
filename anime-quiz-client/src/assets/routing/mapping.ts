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

const PANEL_MAPPING: { [key: string]: Component } = {
  [ROUTES.LOGIN]: LoginPanel,
  [ROUTES.USER_SETTINGS]: UserSettingsPanel,
  [ROUTES.SONG_LIST_EDIT]: SongListEditPanel,
  [ROUTES.USER_EDIT]: UserEditPanel,
  [ROUTES.ANIME_EDIT]: AnimeEditPanel,
  [ROUTES.SONG_EDIT]: SongListEditPanel
};

const VIEW_MAPPING: { [key: string]: Component } = {
  [ROUTES.LOGIN]: Login,
  [ROUTES.LOBBY]: Lobby,
  [ROUTES.USER_SETTINGS]: UserSettings,
  [ROUTES.SONG_LIST_EDIT]: SongListEdit,
  [ROUTES.USER_EDIT]: UserEdit,
  [ROUTES.ANIME_EDIT]: AnimeEdit,
  [ROUTES.SONG_EDIT]: SongEdit
};

const DIALOG_MAPPINGS: { [key: string]: Component } = {
  [DIALOG_ROUTES.LOGIN_SETTINGS]: LoginSettings,
  [DIALOG_ROUTES.USER_EDIT]: UserEditDialog,
  [DIALOG_ROUTES.ANIME_EDIT]: AnimeEditDialog
};

export { VIEW_MAPPING, PANEL_MAPPING, DIALOG_MAPPINGS };
