import { defineStore } from 'pinia';
import {
  AnimeNameType,
  AnimeType,
  SongTitleType,
  SongType,
  SongIdType,
  UserType,
  AnimeIdType,
  EmojiType
} from '@/assets/shared/models/types';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';

interface State {
  songList: SongType[];
  animeList: AnimeType[];
  songTitles: SongTitleType[];
  animeNames: AnimeNameType[];
  userSongList: SongIdType[];
  userList: UserType[];
  emojiList: EmojiType[];
  dataVersion: string;
}

interface AnimeString {
  animeId: AnimeIdType;
  animeName: string;
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
      dataVersion: localStorage[LOCAL_STORAGE_CONSTANTS.DATA_VERSION] || ''
    };
  },
  actions: {
    updateSongList(songList: SongType[]) {
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
    updateAnimeList(animeList: AnimeType[]) {
      this.animeList = animeList;
    },
    updateSongTitles(songTitles: SongTitleType[]) {
      this.songTitles = songTitles.sort();
    },
    updateAnimeNames(animeNames: AnimeNameType[]) {
      this.animeNames = animeNames.sort();
    },
    updateUserSongList(userSongList: SongIdType[]) {
      this.userSongList = userSongList;
    },
    updateUserList(userList: UserType[]) {
      this.userList = userList;
    },
    updateEmojiList(emojiList: EmojiType[]) {
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
    updateDataVersion(dataVersion: string) {
      this.dataVersion = dataVersion;
    }
  },
  getters: {
    animeStringList(): AnimeString[] {
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
