import { defineStore } from 'pinia';
import { AnimeType, SongType, UserType } from '@/assets/shared/models/types';
import { generateId } from '@/assets/game-helpers';
import { DATABASE_EDIT_MODE } from '@/assets/constants';

interface State {
  userInEdit: UserType;
  editMode: string;
  animeInEdit: AnimeType;
  songInEdit: SongType;
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
      editMode: '',
      animeInEdit: {
        animeId: '',
        animeName: []
      },
      songInEdit: {
        songId: '',
        animeName: [],
        animeId: [],
        src: '',
        songTitle: '',
        artist: '',
        type: 'OP'
      }
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
    },
    generateNewAnimeId() {
      this.animeInEdit.animeId = generateId('anime');
    },
    updateAnimeInEdit(anime: AnimeType) {
      this.animeInEdit = Object.assign({}, anime);
    },
    updateSongInEdit(song: SongType) {
      this.songInEdit = Object.assign({}, song);
    },
    generateNewSongId() {
      this.songInEdit.songId = generateId('song');
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
