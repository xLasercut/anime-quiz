import { defineStore } from 'pinia';
import { DIALOG_ROUTES, ROUTES } from '@/assets/routing/routes';
import { getDefaultVolume } from '@/assets/game-helpers';
import { ClientDataType } from '@/assets/shared/models/types';
import { ClientDialogRoute, ClientRoute } from '@/assets/routing/types';

interface State {
  view: ClientRoute;
  dialogView: ClientDialogRoute;
  volume: number;
  clientData: ClientDataType;
}

const useGameStore = defineStore('game', {
  state: (): State => {
    return {
      view: ROUTES.LOGIN,
      dialogView: DIALOG_ROUTES.LOGIN_SETTINGS,
      volume: getDefaultVolume(),
      clientData: {
        admin: false,
        discordId: '',
        host: false,
        displayName: '',
        userId: '',
        auth: false,
        avatar: ''
      }
    };
  },
  actions: {
    updateClientData(clientData: ClientDataType) {
      this.clientData = clientData;
    },
    changeView(view: ClientRoute) {
      this.view = view;
    },
    changeDialogView(view: ClientDialogRoute) {
      this.dialogView = view;
    }
  }
});

export { useGameStore };
