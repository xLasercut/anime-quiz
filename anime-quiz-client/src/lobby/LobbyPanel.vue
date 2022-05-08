<template>
  <v-btn
    color="error"
    append-icon="mdi-logout"
    variant="outlined"
    size="large"
    @click="logout()"
  >Logout</v-btn>
</template>

<script setup lang="ts">
import {socket} from '../plugins/socket'
import {useStore} from 'vuex'
import {MUTATIONS} from '../plugins/store/mutations'
import {ROUTES} from '../plugins/routing/routes'

const store = useStore()

function logout(): void {
  socket.disconnect()
  store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOGIN)
}
</script>
