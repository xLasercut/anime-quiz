import { Socket } from 'socket.io-client';
import { useDataStore } from '@/plugins/store/data';
import { pinia } from '@/plugins/store';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { AnimeNameType, AnimeType, SongTitleType, SongType } from '@/assets/shared/models/types';
import { Song, SongTitle } from '@/assets/shared/models/song';
import { Anime, AnimeName } from '@/assets/shared/models/anime';

const dataStore = useDataStore(pinia);

function startDataStoreListeners(socket: Socket): void {
  socket.on(SOCKET_EVENTS.UPDATE_STORE_SONG_LIST, (_songList: SongType[]) => {
    const songList = _songList.map((song) => Song.parse(song));
    dataStore.updateSongList(songList);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_ANIME_LIST, (_animeList: AnimeType[]) => {
    const animeList = _animeList.map((anime) => Anime.parse(anime));
    dataStore.updateAnimeList(animeList);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_ANIME_NAMES, (_animeNames: AnimeNameType[]) => {
    const animeNames = _animeNames.map((name) => AnimeName.parse(name));
    dataStore.updateAnimeNames(animeNames);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_SONG_TITLES, (_songTitles: SongTitleType[]) => {
    const songTitles = _songTitles.map((title) => SongTitle.parse(title));
    dataStore.updateSongTitles(songTitles);
  });
}

export { startDataStoreListeners };
