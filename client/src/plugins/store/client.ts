import { defineStore } from 'pinia';
import { DIALOG_ROUTES, ROUTES } from '@/assets/routing/routes';
import { getLocalStorageNumber } from '@/assets/game-helpers';
import { TClientData } from 'anime-quiz-shared-resources/src/models/types';
import { ClientDialogRoute, ClientRoute } from '@/assets/routing/types';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';

interface State {
  view: ClientRoute;
  dialogView: ClientDialogRoute;
  volume: number;
  clientData: TClientData;
  audioOnly: boolean;
}

const useClientStore = defineStore('client', {
  state: (): State => {
    return {
      view: ROUTES.LOGIN,
      dialogView: DIALOG_ROUTES.LOGIN_SETTINGS,
      volume: getLocalStorageNumber(LOCAL_STORAGE_CONSTANTS.AQ_VOLUME, 50),
      clientData: {
        admin: false,
        discordId: '',
        host: false,
        displayName: '',
        userId: '',
        auth: false,
        avatar: '',
        socketId: ''
      },
      audioOnly: false
    };
  },
  actions: {
    updateClientData(clientData: TClientData) {
      this.clientData = clientData;
    },
    changeView(view: ClientRoute) {
      this.view = view;
    },
    changeDialogView(view: ClientDialogRoute) {
      this.dialogView = view;
    },
    updateVolume(volume: number) {
      this.volume = volume;
    },
    toggleAudioOnly() {
      this.audioOnly = !this.audioOnly;
    }
  }
});

export { useClientStore };
