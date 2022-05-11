<template>
  <q-toolbar :class="panelClass()" flat height="50">
    <q-btn color="dark" stretch flat icon-right="mdi-theme-light-dark" label="Theme" @click="changeTheme()"></q-btn>
    <q-space />
    <component :is="panelComponent()"></component>
    <q-btn size="large" v-if="showLogout()" append-icon="mdi-logout" color="error" @click="logOut()" label="Logout"></q-btn>
  </q-toolbar>
</template>

<script setup lang="ts">
import {useStore} from 'vuex'
import {panelComponent} from '../plugins/routing/mapping'
import {MUTATIONS} from '../plugins/store/mutations'
import {socket} from '../plugins/socket'
import {ROUTES} from '../plugins/routing/routes'
import {useQuasar} from 'quasar'
import {onMounted} from 'vue'

const store = useStore()
const quasar = useQuasar()

function changeTheme(): void {
  quasar.dark.set(!quasar.dark.isActive)
  localStorage.darkTheme = quasar.dark.isActive
}

function logOut(): void {
  socket.disconnect()
  store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOGIN)
}

function showLogout(): boolean {
  return store.state.client.view !== ROUTES.LOGIN
}

function panelClass(): string {
  if (quasar.dark.isActive) {
    return 'surface--dark'
  }
  return 'surface--light'
}

onMounted(() => {
  quasar.dark.set(localStorage.darkTheme === 'true')
})
</script>
