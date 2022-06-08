<template>
  <v-data-table
    dense
    disable-sort
    fixed-header
    disable-filtering
    hide-default-footer
    :height="CLIENT_CONSTANTS.TABLE_HEIGHT"
    :headers="headers"
    :items="filteredUserLists()"
    :items-per-page="itemsPerPage"
    :page="currentPage"
  >
    <template #top>
      <v-container fluid>
        <user-edit-table-filter
          :user-id-filter.sync="userIdFilter"
          :username-filter.sync="usernameFilter"
        ></user-edit-table-filter>
      </v-container>
    </template>

    <template #item.action="{item}">
      <v-icon color="warning" @click="editUser(item)">mdi-pencil</v-icon>
      <v-icon color="error" @click="deleteUser(item)">mdi-delete</v-icon>
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
import { AqUserSongs } from '../../assets/shared/interfaces'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { CLIENT_EVENTS } from '../../assets/events'
import { DIALOG_ROUTES } from '../../plugins/routing/routes'
import UserEditTableFilter from './UserEditTableFilter.vue'

export default defineComponent({
  components: { TablePagination, UserEditTableFilter },
  setup() {
    const state = reactive({
      headers: [
        { text: 'User ID', value: 'user_id' },
        { text: 'Username', value: 'username' },
        { text: 'Action', value: 'action' }
      ],
      itemsPerPage: 10,
      currentPage: 0,
      userIdFilter: '',
      usernameFilter: ''
    })

    const openDialog = inject<Function>(CLIENT_EVENTS.OPEN_DIALOG)

    function filteredUserLists(): AqUserSongs[] {
      return store.getters.userLists.filter((userSong: AqUserSongs) => {
        return userSong.user_id.toLowerCase().includes(state.userIdFilter.toLowerCase()) &&
          userSong.username.toLowerCase().includes(state.usernameFilter.toLowerCase())
      })
    }

    function updateStore(user: AqUserSongs): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_USER_NAME, user.username)
      store.commit(MUTATIONS.ADMIN_UPDATE_USER_ID, user.user_id)
    }

    function editUser(user: AqUserSongs): void {
      if (openDialog) {
        updateStore(user)
        openDialog(DIALOG_ROUTES.EDIT_USER_DIALOG, 'Edit User')
      }
    }

    function deleteUser(user: AqUserSongs): void {
      if (openDialog) {
        updateStore(user)
        openDialog(DIALOG_ROUTES.DELETE_USER_DIALOG, 'Delete User')
      }
    }

    return {
      ...toRefs(state),
      CLIENT_CONSTANTS,
      filteredUserLists,
      editUser,
      deleteUser
    }
  }
})
</script>
