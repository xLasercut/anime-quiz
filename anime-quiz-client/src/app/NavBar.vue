<template>
  <v-toolbar flat height="50" color="surface">
    <v-btn size="large" append-icon="mdi-theme-light-dark" @click="changeTheme()">Theme</v-btn>
    <v-spacer></v-spacer>
    <component :is="panelComponent()"></component>
    <v-btn size="large" v-if="showLogout()" append-icon="mdi-logout" color="error" @click="logOut()" >Logout</v-btn>
  </v-toolbar>
</template>

<script setup lang="ts">
import {useStore} from 'vuex'
import {panelComponent} from '../plugins/routing/mapping'
import {MUTATIONS} from '../plugins/store/mutations'
import {socket} from '../plugins/socket'
import {ROUTES} from '../plugins/routing/routes'

const store = useStore()

function changeTheme(): void {
  store.commit(MUTATIONS.CHANGE_THEME)
  localStorage.darkTheme = store.state.client.darkTheme
}

function logOut(): void {
  socket.disconnect()
  store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOGIN)
}

function showLogout(): boolean {
  return store.state.client.view !== ROUTES.LOGIN
}
</script>
