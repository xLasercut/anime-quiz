<template>
  <v-card-text>
    <v-data-table
      dense
      disable-sort
      fixed-header
      disable-filtering
      hide-default-footer
      height="450"
      :headers="headers"
      :items="filteredSongList()"
      :items-per-page="itemsPerPage"
      :page="currentPage"
    >
      <template #top>
        <v-container fluid>
          <game-room-song-picker-filter
            :song-type-filter.sync="songTypeFilter"
            :anime-filter.sync="animeFilter"
            :song-title-filter.sync="songTitleFilter"
          ></game-room-song-picker-filter>
        </v-container>
      </template>

      <template #item.anime_name="{ item }">
        <aq-anime-name :song="item"></aq-anime-name>
      </template>

      <template #item.action="{ item }">
        <v-icon color="success" @click="selectSong(item)">mdi-playlist-check</v-icon>
      </template>

      <template #footer="{ props }">
        <table-pagination
          :current-page="props.pagination.page"
          @input="currentPage = $event"
          :length="props.pagination.pageCount"
          :items-per-page.sync="itemsPerPage"
          width="400px"
        ></table-pagination>
      </template>
    </v-data-table>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import TablePagination from '../shared/TablePagination.vue';
import { ISong } from '../../assets/shared/interfaces';
import { store } from '../../plugins/store';
import { shouldDisplayResult } from '../../assets/game-helper';
import AqAnimeName from '../shared/AqAnimeName.vue';
import GameRoomSongPickerFilter from './GameRoomSongPickerFilter.vue';
import { socket } from '../../plugins/socket';
import { SHARED_EVENTS } from '../../assets/shared/events';

export default defineComponent({
  components: { GameRoomSongPickerFilter, TablePagination, AqAnimeName },
  setup(_props, context) {
    const state = reactive({
      headers: [
        { text: 'Anime', value: 'anime_name' },
        { text: 'Title', value: 'song_title' },
        { text: 'Type', value: 'type' },
        { text: 'Action', value: 'action' }
      ],
      itemsPerPage: 10,
      currentPage: 0,
      animeFilter: '',
      songTypeFilter: '',
      songTitleFilter: ''
    });

    function filteredSongList(): ISong[] {
      return store.getters.songList.filter((song: ISong) => {
        return (
          shouldDisplayResult(state.animeFilter, song.anime_name.join(',')) &&
          shouldDisplayResult(state.songTitleFilter, song.song_title) &&
          song.type.toLowerCase().includes(state.songTypeFilter.toLowerCase())
        );
      });
    }

    function selectSong(song: ISong): void {
      socket.emit(SHARED_EVENTS.ADMIN_GAME_SONG_OVERRIDE, song.song_id);
      context.emit('dialog:close');
    }

    return {
      ...toRefs(state),
      filteredSongList,
      selectSong
    };
  }
});
</script>
