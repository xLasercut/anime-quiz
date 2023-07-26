import { Component } from 'vue';
import { ROUTES } from 'anime-quiz-client/src/plugins/routing/routes';
import Login from '@/views/Login.vue';
import Lobby from '@/views/Lobby.vue';
import LoginPanel from '@/components/login/LoginPanel.vue';

const PANEL_MAPPING = Object.freeze<{ [key: string]: Component }>({
  [ROUTES.LOGIN]: LoginPanel
});

const VIEW_MAPPING = Object.freeze<{ [key: string]: Component }>({
  [ROUTES.LOGIN]: Login,
  [ROUTES.LOBBY]: Lobby
});

export { VIEW_MAPPING, PANEL_MAPPING };
