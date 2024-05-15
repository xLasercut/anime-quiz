import { defineStore } from 'pinia';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { getLocalStorageNumber } from '@/assets/game-helpers';
import { TClientData } from 'anime-quiz-shared-resources';
import { ClientDialogRoute } from '@/assets/routing/types';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';

interface State {
  dialogView: ClientDialogRoute;
  volume: number;
  clientData: TClientData;
  audioOnly: boolean;
  mediaPreviewSrc: string;
}

const useClientStore = defineStore('client', {
  state: (): State => {
    return {
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
      audioOnly: false,
      mediaPreviewSrc: ''
    };
  },
  actions: {
    updateClientData(clientData: TClientData) {
      this.clientData = clientData;
    },
    changeDialogView(view: ClientDialogRoute) {
      this.dialogView = view;
    },
    updateVolume(volume: number) {
      this.volume = volume;
    },
    setMediaPreviewSrc(src: string) {
      this.mediaPreviewSrc = src;
    }
  }
});

export { useClientStore };
