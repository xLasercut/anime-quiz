<template>
  <v-data-table
    dense
    disable-sort
    fixed-header
    disable-filtering
    hide-default-footer
    :height="CLIENT_CONSTANTS.TABLE_HEIGHT"
    :headers="headers"
    :items="filteredSongList()"
    :items-per-page="itemsPerPage"
    :page="currentPage"
  >
    <template #top>
      <v-container fluid>
        <song-edit-table-filter
          :song-id-filter.sync="songIdFilter"
          :song-type-filter.sync="songTypeFilter"
          :anime-filter.sync="animeFilter"
          :song-title-filter.sync="songTitleFilter"
        ></song-edit-table-filter>
        <song-edit-table-actions></song-edit-table-actions>
      </v-container>
    </template>

    <template #item.anime_name="{ item }">
      <aq-anime-name :song="item"></aq-anime-name>
    </template>

    <template #item.src="{ item }">
      <a :href="item.src" target="_blank">View</a>
    </template>

    <template #item.action="{item}">
      <v-icon color="warning" @click="editSong(item)">mdi-pencil</v-icon>
      <v-icon color="error" @click="deleteSong(item)">mdi-delete</v-icon>
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
</template>

<script lang="ts">
import { defineComponent, inject, reactive, toRefs } from '@vue/composition-api'
import TablePagination from '../shared/TablePagination.vue'
import { CLIENT_CONSTANTS } from '../../assets/constants'
import { AqSong } from '../../assets/shared/interfaces'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { CLIENT_EVENTS } from '../../assets/events'
import { DIALOG_ROUTES } from '../../plugins/routing/routes'
import SongEditTableFilter from './SongEditTableFilter.vue'
import SongEditTableActions from './SongEditTableActions.vue'
import { shouldDisplayResult } from '../../assets/game-helper'
import AqAnimeName from '../shared/AqAnimeName.vue'

export default defineComponent({
  components: { AqAnimeName, SongEditTableActions, SongEditTableFilter, TablePagination },
  setup() {
    const state = reactive({
      headers: [
        { text: 'Song ID', value: 'song_id' },
        { text: 'Anime', value: 'anime_name' },
        { text: 'Title', value: 'song_title' },
        { text: 'Artist', value: 'artist' },
        { text: 'Source', value: 'src' },
        { text: 'Type', value: 'type' },
        { text: 'Action', value: 'action' }
      ],
      itemsPerPage: 10,
      currentPage: 0,
      animeFilter: '',
      songTypeFilter: '',
      songTitleFilter: '',
      songIdFilter: ''
    })

    const openDialog = inject<Function>(CLIENT_EVENTS.OPEN_DIALOG)

    function filteredSongList(): AqSong[] {
      return store.getters.songList.filter((song: AqSong) => {
        return shouldDisplayResult(state.animeFilter, song.anime_name.join(',')) &&
          shouldDisplayResult(state.songTitleFilter, song.song_title) &&
          song.type.toLowerCase().includes(state.songTypeFilter.toLowerCase()) &&
          song.song_id.toLowerCase().includes(state.songIdFilter.toLowerCase())
      })
    }

    function updateStore(song: AqSong): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_ANIME_NAME, song.anime_name)
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_ANIME_ID, song.anime_id)
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_ID, song.song_id)
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_TITLE, song.song_title)
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_ARTIST, song.artist)
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_SRC, song.src)
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_TYPE, song.type)
    }

    function editSong(song: AqSong): void {
      if (openDialog) {
        updateStore(song)
        openDialog(DIALOG_ROUTES.EDIT_SONG_DIALOG, 'Edit Song')
      }
    }

    function deleteSong(song: AqSong): void {
      if (openDialog) {
        updateStore(song)
        openDialog(DIALOG_ROUTES.DELETE_SONG_DIALOG, 'Delete Song')
      }
    }

    return {
      ...toRefs(state),
      CLIENT_CONSTANTS,
      filteredSongList,
      editSong,
      deleteSong
    }
  }
})
</script>
