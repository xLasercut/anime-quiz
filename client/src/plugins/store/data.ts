import { defineStore } from 'pinia';
import {
  TAnimeName,
  TAnime,
  TBotMessage,
  TEmoji,
  TSongId,
  TSongStatsRecords,
  TSongTitle,
  TSong,
  TUser
} from 'anime-quiz-shared-resources/src/models/types';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import { TAnimeString } from '@/assets/types';

interface State {
  songList: TSong[];
  animeList: TAnime[];
  songTitles: TSongTitle[];
  animeNames: TAnimeName[];
  userSongList: TSongId[];
  userList: TUser[];
  emojiList: TEmoji[];
  botMessageList: TBotMessage[];
  songStatsRecords: TSongStatsRecords;
  dataVersion: string;
}

const useDataStore = defineStore('data', {
  state: (): State => {
    return {
      songList: JSON.parse(localStorage[LOCAL_STORAGE_CONSTANTS.SONG_LIST] || '[]'),
      animeList: JSON.parse(localStorage[LOCAL_STORAGE_CONSTANTS.ANIME_LIST] || '[]'),
      songTitles: JSON.parse(localStorage[LOCAL_STORAGE_CONSTANTS.SONG_TITLES] || '[]'),
      animeNames: JSON.parse(localStorage[LOCAL_STORAGE_CONSTANTS.ANIME_NAMES] || '[]'),
      userSongList: [],
      userList: [],
      emojiList: JSON.parse(localStorage[LOCAL_STORAGE_CONSTANTS.EMOJI_LIST] || '[]'),
      botMessageList: [],
      dataVersion: localStorage[LOCAL_STORAGE_CONSTANTS.DATA_VERSION] || '',
      songStatsRecords: {}
    };
  },
  actions: {
    updateSongList(songList: TSong[]) {
      this.songList = songList.sort((a, b) => {
        const animeA = a.animeName[0];
        const animeB = b.animeName[0];

        if (animeA === animeB) {
          return 0;
        }
        if (animeA > animeB) {
          return 1;
        }
        return -1;
      });
    },
    updateAnimeList(animeList: TAnime[]) {
      this.animeList = animeList;
    },
    updateSongTitles(songTitles: TSongTitle[]) {
      this.songTitles = songTitles.sort();
    },
    updateAnimeNames(animeNames: TAnimeName[]) {
      this.animeNames = animeNames.sort();
    },
    updateUserSongList(userSongList: TSongId[]) {
      this.userSongList = userSongList;
    },
    updateUserList(userList: TUser[]) {
      this.userList = userList;
    },
    updateEmojiList(emojiList: TEmoji[]) {
      this.emojiList = emojiList.sort((a, b) => {
        if (a.command === b.command) {
          return 0;
        }
        if (a.command > b.command) {
          return 1;
        }
        return -1;
      });
    },
    updateBotMessageList(botMessageList: TBotMessage[]) {
      this.botMessageList = botMessageList.sort((a, b) => {
        if (a.displayName === b.displayName) {
          return 0;
        }
        if (a.displayName > b.displayName) {
          return 1;
        }
        return -1;
      });
    },
    updateSongStatsRecords(songStatsRecords: TSongStatsRecords) {
      this.songStatsRecords = songStatsRecords;
    },
    updateDataVersion(dataVersion: string) {
      this.dataVersion = dataVersion;
    }
  },
  getters: {
    animeStringList(): TAnimeString[] {
      return this.animeList.map((anime) => {
        return {
          animeId: anime.animeId,
          animeName: anime.animeName.join(',')
        };
      });
    }
  }
});

export { useDataStore };
