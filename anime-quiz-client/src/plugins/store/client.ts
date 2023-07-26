import { defineStore } from 'pinia';
import { ROUTES } from '@/assets/routing/routes';
import { getDefaultVolume } from '@/assets/game-helpers';
import { ClientDataType } from '@/assets/shared/models/types';

interface State {
  view: string;
  dialogView: string;
  volume: number;
  clientData: ClientDataType;
}

const useClientStore = defineStore('client', {
  state: (): State => {
    return {
      view: ROUTES.LOGIN,
      dialogView: '',
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
      this.clientData = clientData
    },
    changeView(view: string) {
      this.view = view
    },
    changeDialogView(view: string) {
      this.dialogView = view
    }
  }
});

export { useClientStore };
