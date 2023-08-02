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
import NewUserDialog from '@/components/user-edit/NewUserDialog.vue';

const PANEL_MAPPING: { [key: string]: Component } = {
  [ROUTES.LOGIN]: LoginPanel,
  [ROUTES.USER_SETTINGS]: UserSettingsPanel,
  [ROUTES.SONG_LIST_EDIT]: SongListEditPanel,
  [ROUTES.USER_EDIT]: UserEditPanel
};

const VIEW_MAPPING: { [key: string]: Component } = {
  [ROUTES.LOGIN]: Login,
  [ROUTES.LOBBY]: Lobby,
  [ROUTES.USER_SETTINGS]: UserSettings,
  [ROUTES.SONG_LIST_EDIT]: SongListEdit,
  [ROUTES.USER_EDIT]: UserEdit
};

const DIALOG_MAPPINGS: { [key: string]: Component } = {
  [DIALOG_ROUTES.LOGIN_SETTINGS]: LoginSettings,
  [DIALOG_ROUTES.NEW_USER]: NewUserDialog
};

export { VIEW_MAPPING, PANEL_MAPPING, DIALOG_MAPPINGS };
