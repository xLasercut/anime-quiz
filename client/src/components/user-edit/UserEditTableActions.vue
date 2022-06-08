<template>
  <v-row dense justify="center">
    <v-col cols="auto">
      <icon-btn
        icon="mdi-plus"
        color="success"
        @click="newUser()"
      >
        New User
      </icon-btn>
    </v-col>
    <v-col cols="auto">
      <icon-btn color="info" @click="reload()" icon="mdi-refresh">Reload</icon-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, inject } from '@vue/composition-api'
import IconBtn from '../shared/buttons/IconBtn.vue'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { socket } from '../../plugins/socket'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { CLIENT_EVENTS } from '../../assets/events'
import { DIALOG_ROUTES } from '../../plugins/routing/routes'

export default defineComponent({
  components: { IconBtn },
  setup() {
    function reload(): void {
      store.commit(MUTATIONS.SOCKET_UPDATE_USER_LISTS, [])
      socket.emit(SHARED_EVENTS.GET_USER_LISTS)
    }

    const openDialog = inject<Function>(CLIENT_EVENTS.OPEN_DIALOG)

    function newUser(): void {
      if (openDialog) {
        store.commit(MUTATIONS.ADMIN_UPDATE_USER_ID, '')
        store.commit(MUTATIONS.ADMIN_UPDATE_USER_NAME, '')
        openDialog(DIALOG_ROUTES.NEW_USER_DIALOG, 'New User')
      }
    }

    return {
      reload,
      newUser
    }
  }
})
</script>
