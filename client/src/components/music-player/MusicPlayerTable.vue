<template>
  <v-data-table
    :headers="headers"
    :items="filteredSongList()"
    :fixed-header="true"
    :fixed-footer="true"
    density="compact"
    v-model:page="currentPage"
    :items-per-page="itemsPerPage"
    :height="CLIENT_CONSTANTS.MUSIC_PLAYER_TABLE_HEIGHT"
  >
    <template #item.animeName="{ item }">
      <table-anime-name :song="item"></table-anime-name>
    </template>

    <template #item.action="{ item }">
      <table-action-btn
        icon="mdi-play-box"
        :color="songPickBtnColor(item)"
        @click="currentSong = item"
        :disabled="songPickBtnDisabled(item)"
      ></table-action-btn>
    </template>

    <template #top>
      <v-container :fluid="true">
        <music-player-table-player
          :song="currentSong"
          @next="nextSong()"
          @previous="previousSong()"
          @set-initial-song="playInitialSong()"
        ></music-player-table-player>
        <song-list-edit-table-filters
          v-model:anime.trim="filters.anime"
          v-model:title.trim="filters.title"
          v-model:artist.trim="filters.artist"
          v-model:type.trim="filters.type"
        ></song-list-edit-table-filters>
      </v-container>
    </template>

    <template #bottom="{ pageCount }">
      <table-pagination v-model:current-page="currentPage" v-model:items-per-page="itemsPerPage" :length="pageCount"></table-pagination>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { useDataStore } from '@/plugins/store/data';
import TableAnimeName from '@/components/common/tables/TableAnimeName.vue';
import { ref, watch } from 'vue';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import { CLIENT_CONSTANTS } from '@/assets/constants';
import MusicPlayerTablePlayer from '@/components/music-player/MusicPlayerTablePlayer.vue';
import { SongType } from '@/assets/shared/models/types';
import { SONG_TYPES } from '@/assets/shared/song-types';
import TableActionBtn from '@/components/common/buttons/TableActionBtn.vue';
import { isMatchFilter } from '@/assets/game-helpers';
import SongListEditTableFilters from '@/components/song-list-edit/SongListEditTableFilters.vue';

const dataStore = useDataStore();

const headers = [
  { title: 'Anime', key: 'animeName', sortable: false },
  { title: 'Title', key: 'songTitle', sortable: false },
  { title: 'Artist', key: 'artist', sortable: false },
  { title: 'Type', key: 'type', sortable: false },
  { title: 'Action', key: 'action', sortable: false }
];

const currentPage = ref(1);
const itemsPerPage = ref(10);
const currentSong = ref<SongType>({
  songId: '',
  src: '',
  type: SONG_TYPES.OP,
  songTitle: '',
  artist: '',
  animeName: [],
  animeId: []
});
const filters = ref({
  anime: '',
  title: '',
  artist: '',
  type: Object.values(SONG_TYPES)
});

watch(
  () => currentSong.value,
  (val: SongType) => {
    const songIndex = filteredSongList().indexOf(val);
    currentPage.value = Math.floor(songIndex / itemsPerPage.value) + 1;
  }
);

function filteredSongList() {
  return dataStore.songList
    .filter((song) => {
      return dataStore.userSongList.includes(song.songId);
    })
    .filter((song) => {
      return (
        isMatchFilter(filters.value.anime, song.animeName.join(',')) &&
        isMatchFilter(filters.value.title, song.songTitle) &&
        isMatchFilter(filters.value.artist, song.artist) &&
        filters.value.type.includes(song.type)
      );
    });
}

function songPickBtnDisabled(song: SongType): boolean {
  return currentSong.value.songId === song.songId;
}

function songPickBtnColor(song: SongType): string {
  if (songPickBtnDisabled(song)) {
    return 'primary';
  }
  return 'success';
}

function nextSong() {
  const songList = filteredSongList();

  if (songList.length <= 0) {
    return;
  }

  const currentIndex = songList.indexOf(currentSong.value);
  if (currentIndex >= songList.length - 1) {
    currentSong.value = songList[0];
    return;
  }
  currentSong.value = songList[currentIndex + 1];
}

function previousSong() {
  const songList = filteredSongList();

  if (songList.length <= 0) {
    return;
  }

  const currentIndex = songList.indexOf(currentSong.value);
  if (currentIndex <= 0) {
    currentSong.value = songList[songList.length - 1];
    return;
  }
  currentSong.value = songList[currentIndex - 1];
}

function playInitialSong() {
  const songList = filteredSongList();
  if (songList.length > 0) {
    currentSong.value = songList[0];
  }
}
</script>
