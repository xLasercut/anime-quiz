<template>
  <v-data-table
    :height="CLIENT_CONSTANTS.SONG_LIST_EDIT_TABLE_HEIGHT"
    v-model:page="currentPage"
    :items-per-page="itemsPerPage"
    density="compact"
    :items="filteredSongs()"
    :headers="headers"
    :fixed-header="true"
    :fixed-footer="true"
    :show-select="editMode !== SONG_LIST_EDIT_MODE.NONE"
    v-model="songsSelected"
    item-value="songId"
  >
    <template #header.data-table-select></template>
    <template #item.data-table-select="{ isSelected, toggleSelect, item }">
      <v-checkbox
        :model-value="isSelected({ value: item.songId, selectable: true })"
        @update:model-value="toggleSelect({ value: item.songId, selectable: true })"
        density="compact"
        hide-details
        :true-icon="checkboxIcon()"
        :color="checkboxColor()"
        :disabled="checkboxDisabled(item.songId, isSelected({ value: item.songId, selectable: true }))"
        :false-icon="checkboxFalseIcon(checkboxDisabled(item.songId, isSelected({ value: item.songId, selectable: true })))"
      ></v-checkbox>
    </template>
    <template #item.animeName="{ item }">
      <table-anime-name :song="item"></table-anime-name>
    </template>

    <template #item.src="{ item }">
      <a :href="item.src" target="_blank">View</a>
    </template>

    <template #top>
      <v-container :fluid="true">
        <song-list-edit-table-filters
          v-model:anime.trim="filters.anime"
          v-model:title.trim="filters.title"
          v-model:artist.trim="filters.artist"
          v-model:type.trim="filters.type"
        ></song-list-edit-table-filters>
        <song-list-edit-table-actions
          :disabled="disabled"
          v-model="editMode"
          @submit:change="submitChange()"
        ></song-list-edit-table-actions>
      </v-container>
    </template>

    <template #bottom="{ pageCount }">
      <table-pagination v-model:current-page="currentPage" v-model:items-per-page="itemsPerPage" :length="pageCount"></table-pagination>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { SongIdType, SongType } from '@/assets/shared/models/types';
import TableAnimeName from '@/components/common/tables/TableAnimeName.vue';
import { CLIENT_CONSTANTS, SONG_LIST_EDIT_MODE } from '@/assets/constants';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import SongListEditTableFilters from '@/components/song-list-edit/SongListEditTableFilters.vue';
import { isMatchFilter } from '@/assets/game-helpers';
import SongListEditTableActions from '@/components/song-list-edit/SongListEditTableActions.vue';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';
import { fi } from 'vuetify/locale';
import { SONG_TYPES } from '@/assets/shared/song-types';

const dataStore = useDataStore();
const headers = [
  { title: 'Anime', key: 'animeName', sortable: false },
  { title: 'Title', key: 'songTitle', sortable: false },
  { title: 'Artist', key: 'artist', sortable: false },
  { title: 'Type', key: 'type', sortable: false },
  { title: 'Source', key: 'src', sortable: false }
];
const currentPage = ref(1);
const itemsPerPage = ref(15);
const songsSelected = ref([]);
const filters = ref({
  anime: '',
  type: Object.values(SONG_TYPES),
  title: '',
  artist: ''
});
const editMode = ref(SONG_LIST_EDIT_MODE.NONE);
const disabled = ref(false);

watch(
  () => editMode.value,
  () => {
    songsSelected.value = [];
  }
);

function filteredSongs(): SongType[] {
  return dataStore.songList
    .filter((song) => {
      if (editMode.value !== SONG_LIST_EDIT_MODE.REMOVE) {
        return true;
      }
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

function checkboxFalseIcon(disabled: boolean): string {
  if (disabled) {
    return 'mdi-checkbox-blank-off-outline';
  }
  return 'mdi-checkbox-blank-outline';
}

function checkboxIcon(): string {
  if (editMode.value === SONG_LIST_EDIT_MODE.REMOVE) {
    return 'mdi-minus-box';
  }
  return 'mdi-checkbox-marked';
}

function checkboxColor(): string {
  if (editMode.value === SONG_LIST_EDIT_MODE.REMOVE) {
    return 'error';
  }
  return 'success';
}

function checkboxDisabled(songId: SongIdType, isSelected: boolean): boolean {
  if (disabled.value) {
    return true;
  }

  if (songsSelected.value.length >= 50 && !isSelected) {
    return true;
  }

  return editMode.value === SONG_LIST_EDIT_MODE.ADD && dataStore.userSongList.includes(songId);
}

const CHANGE_MAP = {
  [SONG_LIST_EDIT_MODE.ADD]: SOCKET_EVENTS.ADD_USER_SONGS,
  [SONG_LIST_EDIT_MODE.REMOVE]: SOCKET_EVENTS.REMOVE_USER_SONGS
};

function submitChange() {
  if (songsSelected.value.length > 0) {
    disabled.value = true;
    const event = CHANGE_MAP[editMode.value];
    socket.emit(event, songsSelected.value, (success: boolean) => {
      disabled.value = false;
      if (success) {
        songsSelected.value = [];
      }
    });
  }
}
</script>
