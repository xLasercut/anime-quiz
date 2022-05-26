<template>
  <v-data-table
    dense
    disable-sort
    fixed-header
    disable-filtering
    hide-default-footer
    :headers="headers"
    :height="CLIENT_CONSTANTS.TABLE_HEIGHT"
    :items="$store.getters.filteredSongList"
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
        v-show="isSelectDisabled(item)"
        :color="checkboxColor(isSelected)"
        :on-icon="checkboxOnIcon()"
      ></v-simple-checkbox>
    </template>

    <template #top>
      <v-container fluid>
        <song-list-table-filter v-model="selectedUser"></song-list-table-filter>
        <song-list-table-actions
          v-model="editMode"
          :disabled="!selectedUser && !loading"
          @confirm:edit="submitEdit()"
        ></song-list-table-actions>
      </v-container>
    </template>

    <template #item.src="{ item }">
      <a :href="item.src" target="_blank">View</a>
    </template>

    <template #footer="{ props }">
      <div class="v-data-footer">
        <div class="v-data-footer__pagination">
          <v-pagination
            :value="props.pagination.page"
            @input="currentPage = $event"
            :length="props.pagination.pageCount"
            :total-visible="10"
          ></v-pagination>
        </div>
        <div class="v-data-footer__select">
          Rows per page:
          <v-select v-model="itemsPerPage" hide-details dense outlined :items="paginationSelectItems"></v-select>
        </div>
      </div>
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

export default defineComponent({
  components: { SongListTableActions, SongListTableFilter },
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
      loading: false
    })

    const songSelected = ref<AqSong[]>([])

    watch(() => state.editMode, () => {
      songSelected.value = []
    })

    function isSelectDisabled(song: AqSong): boolean {
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
        state.loading = true
        const songIds = songSelected.value.map((song) => {
          return song.song_id
        })
        socket.emit(SHARED_EVENTS.EDIT_USER_LIST, songIds, state.selectedUser, state.editMode, () => {
          songSelected.value = []
          state.loading = false
        })
      }
    }


    return {
      ...toRefs(state),
      songSelected,
      CLIENT_CONSTANTS,
      isSelectDisabled,
      submitEdit,
      checkboxColor,
      checkboxOnIcon
    }
  }
})
</script>
