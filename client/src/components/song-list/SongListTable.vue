<template>
  <v-data-table
    dense
    disable-sort
    fixed-header
    disable-filtering
    hide-default-footer
    :headers="headers"
    :height="CLIENT_CONSTANTS.TABLE_HEIGHT"
    :items="filteredSongList()"
    :page="currentPage"
    :items-per-page="itemsPerPage"
    show-select
    v-model="songSelected"
    :single-select="false"
    item-key="song_id"
  >
    <template #header.data-table-select>
    </template>

    <template #item.data-table-select="{ select, isSelected, item }">
      <v-simple-checkbox
        :value="isSelected"
        @input="select"
        class="v-data-table__checkbox"
        :ripple="false"
        v-show="isSelectDisabled(item, isSelected)"
        :color="checkboxColor(isSelected)"
        :on-icon="checkboxOnIcon()"
      ></v-simple-checkbox>
    </template>

    <template #top>
      <v-container fluid>
        <song-list-table-filter
          :selected-user.sync="selectedUser"
          :anime-filter.sync="animeFilter"
          :song-title-filter.sync="songTitleFilter"
          :song-type-filter.sync="songTypeFilter"
          :song-artist-filter.sync="songArtistFilter"
        ></song-list-table-filter>
        <song-list-table-actions
          v-model="editMode"
          :disabled="!selectedUser && !loading"
          @confirm:edit="submitEdit()"
        ></song-list-table-actions>
      </v-container>
    </template>

    <template #item.anime_name="{ item }">
      <aq-anime-name :song="item"></aq-anime-name>
    </template>

    <template #item.src="{ item }">
      <a :href="item.src" target="_blank">View</a>
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
import { defineComponent, reactive, ref, toRefs, watch } from '@vue/composition-api'
import { CLIENT_CONSTANTS } from '../../assets/constants'
import SongListTableFilter from './song-list-table/SongListTableFilter.vue'
import { store } from '../../plugins/store'
import { AqSong } from '../../assets/shared/interfaces'
import SongListTableActions from './song-list-table/SongListTableActions.vue'
import { SONG_LIST_EDIT_MODE } from '../../assets/shared/constants'
import { socket } from '../../plugins/socket'
import { SHARED_EVENTS } from '../../assets/shared/events'
import TablePagination from '../shared/TablePagination.vue'
import { shouldDisplayResult } from '../../assets/game-helper'
import AqAnimeName from '../shared/AqAnimeName.vue'

export default defineComponent({
  components: { AqAnimeName, TablePagination, SongListTableActions, SongListTableFilter },
  setup() {
    const state = reactive({
      headers: [
        { text: 'Anime', value: 'anime_name' },
        { text: 'Title', value: 'song_title' },
        { text: 'Artist', value: 'artist' },
        { text: 'Type', value: 'type' },
        { text: 'Source', value: 'src' }
      ],
      currentPage: 1,
      itemsPerPage: 10,
      paginationSelectItems: [ 5, 10, 15, 20 ],
      selectedUser: '',
      editMode: SONG_LIST_EDIT_MODE.NONE,
      loading: false,
      animeFilter: '',
      songTypeFilter: '',
      songTitleFilter: '',
      songArtistFilter: ''
    })

    const songSelected = ref<AqSong[]>([])

    watch(() => state.editMode, () => {
      songSelected.value = []
    })

    watch(() => state.selectedUser, () => {
      songSelected.value = []
    })

    function isSelectDisabled(song: AqSong, isSelected: boolean): boolean {
      if (songSelected.value.length >= 50 && !isSelected) {
        return false
      }

      if (!state.selectedUser || state.editMode === SONG_LIST_EDIT_MODE.NONE) {
        return false
      }

      if (state.editMode === SONG_LIST_EDIT_MODE.ADD &&
        !store.getters.userList(state.selectedUser).includes(song.song_id)) {
        return true
      }

      return !!(state.editMode === SONG_LIST_EDIT_MODE.REMOVE &&
        store.getters.userList(state.selectedUser).includes(song.song_id))
    }

    function checkboxColor(isSelected: boolean): string {
      if (isSelected && state.editMode === SONG_LIST_EDIT_MODE.ADD) {
        return 'success'
      }

      if (isSelected && state.editMode === SONG_LIST_EDIT_MODE.REMOVE) {
        return 'error'
      }

      return ''
    }

    function checkboxOnIcon(): string {
      if (state.editMode === SONG_LIST_EDIT_MODE.REMOVE) {
        return 'mdi-minus-box'
      }
      return 'mdi-checkbox-marked'
    }

    function submitEdit(): void {
      if (songSelected.value.length > 0) {
        const songIds = songSelected.value.map((song) => {
          return song.song_id
        })
        if (state.editMode === SONG_LIST_EDIT_MODE.ADD) {
          state.loading = true
          socket.emit(SHARED_EVENTS.ADD_USER_SONGS, songIds, state.selectedUser, (proceed: boolean) => {
            if (proceed) {
              songSelected.value = []
            }
            state.loading = false
          })
        } else if (state.editMode === SONG_LIST_EDIT_MODE.REMOVE) {
          state.loading = true
          socket.emit(SHARED_EVENTS.DELETE_USER_SONGS, songIds, state.selectedUser, (proceed: boolean) => {
            if (proceed) {
              songSelected.value = []
            }
            state.loading = false
          })
        }
      }
    }

    function filteredSongList(): AqSong[] {
      return store.getters.songList
        .filter((song: AqSong) => {
          if (state.selectedUser && state.editMode === SONG_LIST_EDIT_MODE.REMOVE) {
            return store.getters.userList(state.selectedUser).includes(song.song_id)
          }

          return true
        })
        .filter((song: AqSong) => {
        return shouldDisplayResult(state.animeFilter, song.anime_name.join(',')) &&
          shouldDisplayResult(state.songTitleFilter, song.song_title) &&
          song.type.toLowerCase().includes(state.songTypeFilter.toLowerCase()) &&
          shouldDisplayResult(state.songArtistFilter, song.artist)
        })
    }


    return {
      ...toRefs(state),
      songSelected,
      CLIENT_CONSTANTS,
      isSelectDisabled,
      submitEdit,
      checkboxColor,
      checkboxOnIcon,
      filteredSongList
    }
  }
})
</script>
