<template>
  <v-btn size="large" append-icon="mdi-reload" @click="reload()" color="info">Reload List</v-btn>
  <v-btn size="large" append-icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</v-btn>
</template>

<script setup lang="ts">

import {useStore} from 'vuex'
import {ROUTES} from '../plugins/routing/routes'
import {MUTATIONS} from '../plugins/store/mutations'
import {socket} from '../plugins/socket'
import {SHARED_EVENTS} from '../assets/shared/events'

const store = useStore()

function back(): void {
  store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOBBY)
}

function reload(): void {
  socket.emit(SHARED_EVENTS.GET_SONG_LIST)
  socket.emit(SHARED_EVENTS.GET_ANIME_LIST)
}
</script>
