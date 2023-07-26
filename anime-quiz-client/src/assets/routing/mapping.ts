import { Component } from 'vue';
import { ROUTES } from 'anime-quiz-client/src/plugins/routing/routes';
import Login from '@/views/Login.vue';
import Lobby from '@/views/Lobby.vue';
import LoginPanel from '@/components/login/LoginPanel.vue';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import LoginSettings from '@/components/login/LoginSettings.vue';

const PANEL_MAPPING = Object.freeze<{ [key: string]: Component }>({
  [ROUTES.LOGIN]: LoginPanel
});

const VIEW_MAPPING = Object.freeze<{ [key: string]: Component }>({
  [ROUTES.LOGIN]: Login,
  [ROUTES.LOBBY]: Lobby
});

const DIALOG_MAPPINGS = Object.freeze<{ [key: string]: Component }>({
  [DIALOG_ROUTES.LOGIN_SETTINGS]: LoginSettings
});

export { VIEW_MAPPING, PANEL_MAPPING, DIALOG_MAPPINGS };
