<template>
  <v-app-bar app flat height="40" min-height="40">
    <v-toolbar-items>
      <nav-btn icon="mdi-theme-light-dark" @click="changeTheme()">Theme</nav-btn>
      <nav-btn icon="mdi-shield" v-if="$store.state.client.admin" @click="adminDialog()">Admin</nav-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <component :is="panelComponent()"></component>
    <v-toolbar-items>
      <nav-btn icon="mdi-logout" @click="logOut()" color="error" v-if="showLogout()">Logout</nav-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted } from '@vue/composition-api'
import NavBtn from '@/components/shared/buttons/NavBtn.vue'
import { socket } from '../../plugins/socket'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { DIALOG_ROUTES, ROUTES } from '../../plugins/routing/routes'
import { panelComponent } from '../../plugins/routing/mapping'
import { LOCAL_STORAGE_CONSTANTS } from '../../assets/constants'
import { CLIENT_EVENTS } from '../../assets/events'

export default defineComponent({
  components: { NavBtn },
  setup(_props, context) {
    const vuetify = context.root.$vuetify

    function changeTheme(): void {
      vuetify.theme.dark = !vuetify.theme.dark
      localStorage[LOCAL_STORAGE_CONSTANTS.DARK_THEME] = vuetify.theme.dark
    }

    const openDialog = inject<Function>(CLIENT_EVENTS.OPEN_DIALOG)

    function adminDialog(): void {
      if (openDialog) {
        openDialog(DIALOG_ROUTES.ADMIN, 'Admin')
      }
    }

    function logOut(): void {
      socket.disconnect()
      store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOGIN)
    }

    function showLogout(): boolean {
      return store.state.client.view !== ROUTES.LOGIN
    }

    onMounted(() => {
      vuetify.theme.dark = localStorage[LOCAL_STORAGE_CONSTANTS.DARK_THEME] === 'true'
    })

    return {
      changeTheme,
      panelComponent,
      logOut,
      showLogout,
      adminDialog
    }
  }
})
</script>
