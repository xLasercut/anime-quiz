import { defineStore } from 'pinia';
import { AnimeNameType, AnimeType, SongTitleType, SongType } from '@/assets/shared/models/types';

interface State {
  songList: SongType[];
  animeList: AnimeType[];
  songTitles: SongTitleType[];
  animeNames: AnimeNameType[];
}

const useDataStore = defineStore('data', {
  state: (): State => {
    return {
      songList: [],
      animeList: [],
      songTitles: [],
      animeNames: []
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
    }
  }
});

export { useDataStore };
