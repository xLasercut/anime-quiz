<template>
  <v-toolbar-items>
    <nav-btn @click="openSettings()" color="primary" icon="mdi-cog">Settings</nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import { defineComponent, inject } from '@vue/composition-api'
import { DIALOG_ROUTES } from '../../plugins/routing/routes'
import { CLIENT_EVENTS } from '../../assets/events'
import NavBtn from '../shared/buttons/NavBtn.vue'

export default defineComponent({
  components: { NavBtn },
  setup() {
    const openDialog = inject<Function>(CLIENT_EVENTS.OPEN_DIALOG)

    function openSettings(): void {
      if (openDialog) {
        openDialog(DIALOG_ROUTES.LOGIN_SETTINGS, 'Settings')
      }
    }

    return {
      openSettings
    }
  }
})
</script>
