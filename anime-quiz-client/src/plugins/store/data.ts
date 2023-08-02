import { defineStore } from 'pinia';
import {
  AnimeNameType,
  AnimeType,
  SongTitleType,
  SongType,
  SongIdType,
  UserType
} from '@/assets/shared/models/types';

interface State {
  songList: SongType[];
  animeList: AnimeType[];
  songTitles: SongTitleType[];
  animeNames: AnimeNameType[];
  userSongList: SongIdType[];
  userList: UserType[];
}

const useDataStore = defineStore('data', {
  state: (): State => {
    return {
      songList: [],
      animeList: [],
      songTitles: [],
      animeNames: [],
      userSongList: [],
      userList: []
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
    }
  }
});

export { useDataStore };
