import { defineStore } from 'pinia';
import { UserType } from '@/assets/shared/models/types';
import { generateId } from '@/assets/game-helpers';
import { DATABASE_EDIT_MODE } from '@/assets/constants';

interface State {
  userInEdit: UserType;
  editMode: string;
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
      },
      editMode: ''
    };
  },
  actions: {
    updateUserInEdit(user: UserType) {
      this.userInEdit = Object.assign({}, user);
    },
    generateNewUserId() {
      this.userInEdit.userId = generateId('user');
    },
    updateEditMode(editMode: string) {
      this.editMode = editMode;
    }
  },
  getters: {
    editModeDisabled(): boolean {
      return this.editMode === DATABASE_EDIT_MODE.EDIT || this.editMode === DATABASE_EDIT_MODE.DELETE;
    },
    deleteModeDisabled(): boolean {
      return this.editMode === DATABASE_EDIT_MODE.DELETE;
    }
  }
});

export { useAdminStore };
