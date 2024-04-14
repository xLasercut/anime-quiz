import { defineStore } from 'pinia';
import { TAnime, TBotMessage, TEmoji, TSongStats, TSong, TUser } from 'anime-quiz-shared-resources/src/models/types';
import { generateId } from '@/assets/game-helpers';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { SONG_TYPES } from 'anime-quiz-shared-resources/src/song-types';
import { AVATARS } from 'anime-quiz-shared-resources/src/avatars';

interface State {
  userInEdit: TUser;
  editMode: string;
  animeInEdit: TAnime;
  songInEdit: TSong;
  emojiInEdit: TEmoji;
  botMessageInEdit: TBotMessage;
  songStatsInEdit: TSongStats;
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
        type: SONG_TYPES.OP,
        audioSrc: ''
      },
      emojiInEdit: {
        emojiId: '',
        command: '',
        src: '',
        type: 'img'
      },
      botMessageInEdit: {
        messageId: '',
        command: '',
        text: '',
        avatar: AVATARS.MADOKA,
        displayName: '',
        userId: ''
      },
      songStatsInEdit: {
        songId: '',
        playCount: 0
      }
    };
  },
  actions: {
    updateUserInEdit(user: TUser) {
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
    updateAnimeInEdit(anime: TAnime) {
      this.animeInEdit = Object.assign({}, anime);
    },
    updateSongInEdit(song: TSong) {
      this.songInEdit = Object.assign({}, song);
    },
    generateNewSongId() {
      this.songInEdit.songId = generateId('song');
    },
    updateEmojiInEdit(emoji: TEmoji) {
      this.emojiInEdit = Object.assign({}, emoji);
    },
    generateNewEmojiId() {
      this.emojiInEdit.emojiId = generateId('emoji');
    },
    updateBotMessageInEdit(botMessage: TBotMessage) {
      this.botMessageInEdit = Object.assign({}, botMessage);
    },
    generateNewBotMessageId() {
      this.botMessageInEdit.messageId = generateId('message');
    },
    generateNewBotMessageUserId() {
      this.botMessageInEdit.userId = generateId('user');
    },
    updateSongStatsInEdit(songStats: TSongStats) {
      this.songStatsInEdit = Object.assign({}, songStats);
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
