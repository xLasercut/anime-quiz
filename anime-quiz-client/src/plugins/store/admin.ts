import { defineStore } from 'pinia';
import { UserType } from '@/assets/shared/models/types';
import { generateId } from '@/assets/game-helpers';

interface State {
  userInEdit: UserType;
}

const useAdminStore = defineStore('admin', {
  state: (): State => {
    return {
      userInEdit: {
        userId: '',
        displayName: '',
        discordId: '',
        admin: false,
        avatar: ''
      }
    };
  },
  actions: {
    updateUserInEdit(user: UserType) {
      this.userInEdit = Object.assign({}, user);
    },
    generateNewUserId() {
      this.userInEdit.userId = generateId('user');
    }
  }
});

export { useAdminStore };
