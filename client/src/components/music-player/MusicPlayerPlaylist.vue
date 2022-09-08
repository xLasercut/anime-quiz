<template>
  <v-card-text>
    <v-data-table
      dense
      disable-sort
      fixed-header
      disable-filtering
      hide-default-footer
      :headers="headers"
      :items="playlist"
      :items-per-page="itemsPerPage"
      :page="currentPage"
      :single-select="true"
      :value="[currentSong]"
      item-key="song_id"
    >
      <template #top>
        <v-select
          hide-details
          outlined
          dense
          label="User"
          item-text="username"
          item-value="user_id"
          :items="$store.getters.userLists"
          clearable
          :value="selectedUser"
          @input="updateFilter('selected-user', $event)"
          @change="$emit('update:playlist')"
        ></v-select>
      </template>

      <template #item.anime_name="{ item }">
        <aq-anime-name :song="item"></aq-anime-name>
      </template>

      <template #item.action="{ item }">
        <v-icon
          :disabled="item.song_id === currentSong.song_id"
          color="success"
          @click="playSong(item)"
          >mdi-play-box</v-icon
        >
      </template>

      <template #footer="{ props }">
        <table-pagination
          :current-page="props.pagination.page"
          @input="currentPage = $event"
          :length="props.pagination.pageCount"
          :items-per-page.sync="itemsPerPage"
        ></table-pagination>
      </template>
    </v-data-table>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, watch } from '@vue/composition-api';
import TablePagination from '../shared/TablePagination.vue';
import AqAnimeName from '../shared/AqAnimeName.vue';
import { newTableHelpers } from '../../assets/table-helper';
import { ISong } from '../../assets/shared/interfaces';

export default defineComponent({
  props: {
    selectedUser: {
      required: true,
      type: String
    },
    playlist: {
      required: true,
      type: Array as PropType<ISong[]>
    },
    currentSong: {
      required: true,
      type: Object as PropType<ISong>
    }
  },
  components: { TablePagination, AqAnimeName },
  setup(props, context) {
    const state = reactive({
      headers: [
        { text: 'Anime', value: 'anime_name' },
        { text: 'Title', value: 'song_title' },
        { text: 'Artist', value: 'artist' },
        { text: 'Type', value: 'type' },
        { text: 'Action', value: 'action' }
      ],
      itemsPerPage: 10,
      currentPage: 0
    });

    watch(
      () => props.currentSong,
      (song) => {
        const songIndex = props.playlist.indexOf(song);
        state.currentPage = Math.floor(songIndex / state.itemsPerPage) + 1;
      }
    );

    function playSong(song: ISong): void {
      context.emit('change:song', props.playlist.indexOf(song));
    }

    const { updateFilter } = newTableHelpers(context);

    return {
      ...toRefs(state),
      updateFilter,
      playSong
    };
  }
});
</script>
