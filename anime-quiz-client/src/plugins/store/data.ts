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

interface State {
  songList: SongType[];
  animeList: AnimeType[];
  songTitles: SongTitleType[];
  animeNames: AnimeNameType[];
  userSongList: SongIdType[];
  userList: UserType[];
  emojiList: EmojiType[];
}

interface AnimeString {
  animeId: AnimeIdType;
  animeName: string;
}

const useDataStore = defineStore('data', {
  state: (): State => {
    return {
      songList: [],
      animeList: [],
      songTitles: [],
      animeNames: [],
      userSongList: [],
      userList: [],
      emojiList: []
    };
  },
  actions: {
    updateSongList(songList: SongType[]) {
      this.songList = songList.sort((a, b) => {
        const animeA = a.animeName[0];
        const animeB = b.animeName[0];

        if (animeA === animeB) {
          return 0;
        } else if (animeA > animeB) {
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
      this.emojiList = emojiList;
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
