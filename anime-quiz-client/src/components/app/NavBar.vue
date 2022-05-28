<template>
  <v-app-bar app flat height="40" min-height="40">
    <v-toolbar-items>
      <nav-btn icon="mdi-theme-light-dark" @click="changeTheme()">Theme</nav-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <component :is="panelComponent()"></component>
    <v-toolbar-items>
      <nav-btn icon="mdi-logout" @click="logOut()" color="error" v-if="showLogout()">Logout</nav-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'
import NavBtn from '@/components/shared/buttons/NavBtn.vue'
import { socket } from '../../plugins/socket'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { ROUTES } from '../../plugins/routing/routes'
import { panelComponent } from '../../plugins/routing/mapping'
import { LOCAL_STORAGE_CONSTANTS } from '../../assets/constants'

export default defineComponent({
  components: { NavBtn },
  setup(_props, context) {
    const vuetify = context.root.$vuetify

    function changeTheme(): void {
      vuetify.theme.dark = !vuetify.theme.dark
      localStorage[LOCAL_STORAGE_CONSTANTS.DARK_THEME] = vuetify.theme.dark
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
      showLogout
    }
  }
})
</script>
