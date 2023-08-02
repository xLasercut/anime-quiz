<template>
  <v-data-table
    :height="CLIENT_CONSTANTS.SONG_LIST_EDIT_TABLE_HEIGHT"
    v-model:page="currentPage"
    density="compact"
    :items="filteredSongs()"
    :headers="headers"
    :fixed-header="true"
    :fixed-footer="true"
    :items-per-page="itemsPerPage"
    :show-select="editMode !== SONG_LIST_EDIT_MODE.NONE"
    v-model="songsSelected"
    item-value="songId"
  >
    <template #column.data-table-select></template>
    <template #item.data-table-select="{ isSelected, toggleSelect, item }">
      <v-checkbox
        :model-value="isSelected(item)"
        @update:model-value="toggleSelect(item)"
        density="compact"
        hide-details
        :true-icon="checkboxIcon()"
        :color="checkboxColor()"
        :disabled="checkboxDisabled(item.raw.songId, isSelected(item))"
      ></v-checkbox>
    </template>
    <template #item.animeName="{ item }">
      <table-anime-name :song="item.raw"></table-anime-name>
    </template>

    <template #item.src="{ item }">
      <a :href="item.raw.src" target="_blank">View</a>
    </template>

    <template #top>
      <v-container :fluid="true">
        <song-list-edit-table-filters
          v-model:anime.trim="filters.anime"
          v-model:title.trim="filters.title"
          v-model:artist.trim="filters.artist"
          v-model:type.trim="filters.type"
        ></song-list-edit-table-filters>
        <song-list-edit-table-actions v-model="editMode"></song-list-edit-table-actions>
      </v-container>
    </template>

    <template #bottom="{ pageCount }">
      <table-pagination
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :length="pageCount"
      ></table-pagination>
    </template>
  </v-data-table>
  {{ songsSelected }}
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { SongIdType, SongType } from '@/assets/shared/models/types';
import TableAnimeName from '@/components/common/tables/TableAnimeName.vue';
import { CLIENT_CONSTANTS, SONG_LIST_EDIT_MODE } from '@/assets/constants';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import SongListEditTableFilters from '@/components/song-list-edit/SongListEditTableFilters.vue';
import { isMatchFilter } from '@/assets/game-helpers';
import SongListEditTableActions from '@/components/song-list-edit/SongListEditTableActions.vue';

export default defineComponent({
  components: {
    SongListEditTableActions,
    SongListEditTableFilters,
    TablePagination,
    TableAnimeName
  },
  setup() {
    const dataStore = useDataStore();
    const state = reactive({
      headers: [
        { title: 'Anime', key: 'animeName', sortable: false },
        { title: 'Title', key: 'songTitle', sortable: false },
        { title: 'Artist', key: 'artist', sortable: false },
        { title: 'Type', key: 'type', sortable: false },
        { title: 'Source', key: 'src', sortable: false }
      ],
      currentPage: 1,
      itemsPerPage: 15,
      songsSelected: [],
      filters: {
        anime: '',
        type: '',
        title: '',
        artist: ''
      },
      editMode: SONG_LIST_EDIT_MODE.NONE
    });

    watch(
      () => state.editMode,
      () => {
        state.songsSelected = [];
      }
    );

    function filteredSongs(): SongType[] {
      return dataStore.songList
        .filter((song) => {
          if (state.editMode !== SONG_LIST_EDIT_MODE.REMOVE) {
            return true;
          }
          return dataStore.userSongList.includes(song.songId);
        })
        .filter((song) => {
          return (
            isMatchFilter(state.filters.anime, song.animeName.join(',')) &&
            isMatchFilter(state.filters.title, song.songTitle) &&
            isMatchFilter(state.filters.artist, song.artist) &&
            isMatchFilter(state.filters.type, song.type)
          );
        });
    }

    function checkboxIcon(): string {
      if (state.editMode === SONG_LIST_EDIT_MODE.REMOVE) {
        return 'mdi-minus-box';
      }
      return 'mdi-checkbox-marked';
    }

    function checkboxColor(): string {
      if (state.editMode === SONG_LIST_EDIT_MODE.REMOVE) {
        return 'error';
      }
      return 'success';
    }

    function checkboxDisabled(songId: SongIdType, isSelected: boolean): boolean {
      if (state.songsSelected.length >= 50 && !isSelected) {
        return true;
      }

      return state.editMode === SONG_LIST_EDIT_MODE.ADD && dataStore.userSongList.includes(songId);
    }

    return {
      ...toRefs(state),
      filteredSongs,
      CLIENT_CONSTANTS,
      SONG_LIST_EDIT_MODE,
      checkboxIcon,
      checkboxColor,
      checkboxDisabled
    };
  }
});
</script>
