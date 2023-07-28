import { defineStore } from 'pinia';
import {
  AnimeNameType,
  AnimeType,
  SongTitleType,
  SongType,
  SongIdType
} from '@/assets/shared/models/types';

interface State {
  songList: SongType[];
  animeList: AnimeType[];
  songTitles: SongTitleType[];
  animeNames: AnimeNameType[];
  userSongList: SongIdType[];
}

const useDataStore = defineStore('data', {
  state: (): State => {
    return {
      songList: [],
      animeList: [],
      songTitles: [],
      animeNames: [],
      userSongList: []
    };
  },
  actions: {
    updateSongList(songList: SongType[]) {
      this.songList = songList;
    },
    updateAnimeList(animeList: AnimeType[]) {
      this.animeList = animeList;
    },
    updateSongTitles(songTitles: SongTitleType[]) {
      this.songTitles = songTitles;
    },
    updateAnimeNames(animeNames: AnimeNameType[]) {
      this.animeNames = animeNames;
    },
    updateUserSongList(userSongList: SongIdType[]) {
      this.userSongList = userSongList;
    }
  }
});

export { useDataStore };
