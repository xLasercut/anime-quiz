<template>
  <v-data-table
    :headers="headers"
    :items="filteredSongList"
    :fixed-header="true"
    :fixed-footer="true"
    density="compact"
    v-model:page="currentPage"
    :items-per-page="itemsPerPage"
    :height="CLIENT_CONSTANTS.MUSIC_PLAYER_TABLE_HEIGHT"
    :no-filter="true"
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
          v-model:shuffle="shuffle"
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
      <table-pagination
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :length="pageCount"
        :local-storage-key="LOCAL_STORAGE_CONSTANTS.MUSIC_PLAYER_TABLE_ITEMS_PER_PAGE"
      ></table-pagination>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { useDataStore } from '@/plugins/store/data';
import TableAnimeName from '@/components/common/tables/TableAnimeName.vue';
import { onMounted, ref, watch } from 'vue';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import { CLIENT_CONSTANTS, LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import MusicPlayerTablePlayer from '@/components/music-player/MusicPlayerTablePlayer.vue';
import { TSong } from 'anime-quiz-shared-resources';
import { SONG_TYPES } from 'anime-quiz-shared-resources';
import TableActionBtn from '@/components/common/buttons/TableActionBtn.vue';
import { isMatchFilter } from '@/assets/game-helpers';
import SongListEditTableFilters from '@/components/song-list-edit/SongListEditTableFilters.vue';
import { usePagination } from '@/assets/pagination-helpers';

const dataStore = useDataStore();

const headers = [
  { title: 'Anime', key: 'animeName', sortable: false },
  { title: 'Title', key: 'songTitle', sortable: false },
  { title: 'Artist', key: 'artist', sortable: false },
  { title: 'Type', key: 'type', sortable: false },
  { title: 'Action', key: 'action', sortable: false, width: '60px' }
];

const { currentPage, itemsPerPage } = usePagination(LOCAL_STORAGE_CONSTANTS.MUSIC_PLAYER_TABLE_ITEMS_PER_PAGE);
const currentSong = ref<TSong>({
  songId: '',
  src: '',
  type: SONG_TYPES.OP,
  songTitle: '',
  artist: '',
  animeName: [],
  animeId: [],
  audioSrc: ''
});
const filters = ref({
  anime: '',
  title: '',
  artist: '',
  type: Object.values(SONG_TYPES)
});
const shuffle = ref(true);
const filteredSongList = ref<TSong[]>([]);

watch(
  () => currentSong.value,
  (val: TSong) => {
    const songIndex = filteredSongList.value.indexOf(val);
    currentPage.value = Math.floor(songIndex / itemsPerPage.value) + 1;
  }
);

watch(
  () => [filters.value.anime, filters.value.title, filters.value.artist, filters.value.type],
  () => {
    filterSongList();
  }
);

function filterSongList() {
  filteredSongList.value = dataStore.songList.filter((song) => {
    return (
      dataStore.userSongList.includes(song.songId) &&
      isMatchFilter(filters.value.anime, song.animeName.join(',')) &&
      isMatchFilter(filters.value.title, song.songTitle) &&
      isMatchFilter(filters.value.artist, song.artist) &&
      filters.value.type.includes(song.type)
    );
  });
}

function songPickBtnDisabled(song: TSong): boolean {
  return currentSong.value.songId === song.songId;
}

function songPickBtnColor(song: TSong): string {
  if (songPickBtnDisabled(song)) {
    return 'primary';
  }
  return 'success';
}

function _getRandomSong(songList: TSong[]): TSong {
  const randomIndex = Math.floor(Math.random() * songList.length);
  return songList[randomIndex];
}

function _getNextSong(songList: TSong[]): TSong {
  if (shuffle.value) {
    return _getRandomSong(songList);
  }
  const currentIndex = songList.indexOf(currentSong.value);
  if (currentIndex >= songList.length - 1) {
    return songList[0];
  }
  return songList[currentIndex + 1];
}

function _getPreviousSong(songList: TSong[]): TSong {
  if (shuffle.value) {
    return _getRandomSong(songList);
  }
  const currentIndex = songList.indexOf(currentSong.value);
  if (currentIndex <= 0) {
    return songList[songList.length - 1];
  }
  return songList[currentIndex - 1];
}

function nextSong() {
  const songList = filteredSongList.value;

  if (songList.length <= 0) {
    return;
  }

  currentSong.value = _getNextSong(songList);
}

function previousSong() {
  const songList = filteredSongList.value;

  if (songList.length <= 0) {
    return;
  }

  currentSong.value = _getPreviousSong(songList);
}

function playInitialSong() {
  const songList = filteredSongList.value;
  if (songList.length <= 0) {
    return;
  }
  if (shuffle.value) {
    currentSong.value = _getRandomSong(songList);
    return;
  }
  currentSong.value = songList[0];
}

onMounted(() => {
  filterSongList();
});
</script>
