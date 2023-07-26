import { Component } from 'vue';
import Login from '@/views/Login.vue';
import Lobby from '@/views/Lobby.vue';
import LoginPanel from '@/components/login/LoginPanel.vue';
import { DIALOG_ROUTES, ROUTES } from '@/assets/routing/routes';
import LoginSettings from '@/components/login/LoginSettings.vue';
import UserSettings from '@/views/UserSettings.vue';
import UserSettingsPanel from "@/components/user-settings/UserSettingsPanel.vue";

const PANEL_MAPPING: { [key: string]: Component } = {
  [ROUTES.LOGIN]: LoginPanel,
  [ROUTES.USER_SETTINGS]: UserSettingsPanel
};

const VIEW_MAPPING: { [key: string]: Component } = {
  [ROUTES.LOGIN]: Login,
  [ROUTES.LOBBY]: Lobby,
  [ROUTES.USER_SETTINGS]: UserSettings
};

const DIALOG_MAPPINGS: { [key: string]: Component } = {
  [DIALOG_ROUTES.LOGIN_SETTINGS]: LoginSettings
};

export { VIEW_MAPPING, PANEL_MAPPING, DIALOG_MAPPINGS };
