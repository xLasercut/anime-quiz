<template>
  <v-app>
    <nav-bar></nav-bar>
    <v-container fluid>
      <component :is="viewComponent()"></component>
    </v-container>
    <system-notification></system-notification>
    <global-dialog></global-dialog>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide } from '@vue/composition-api'
import NavBar from './components/app/NavBar.vue'
import { CLIENT_EVENTS } from './assets/events'
import { SHARED_EVENTS } from './assets/shared/events'
import { NOTIFICATION_COLOR } from './assets/shared/constants'
import { LOCAL_STORAGE_CONSTANTS } from './assets/constants'
import { socket } from './plugins/socket'
import { viewComponent } from './plugins/routing/mapping'
import GlobalDialog from './components/app/GlobalDialog.vue'
import SystemNotification from './components/app/SystemNotification.vue'

export default defineComponent({
  components: { SystemNotification, GlobalDialog, NavBar },
  setup() {
    let sendNotification: Function
    let openDialog: Function
    provide(CLIENT_EVENTS.REGISTER_SEND_NOTIFICATION, (_sendNotification: Function): void => {
      sendNotification = _sendNotification
    })
    provide(CLIENT_EVENTS.REGISTER_OPEN_DIALOG, (_openDialog: Function): void => {
      openDialog = _openDialog
    })

    provide(CLIENT_EVENTS.OPEN_DIALOG, (route: string, label: string): void => {
      openDialog(route, label)
    })
    provide(SHARED_EVENTS.SYSTEM_NOTIFICATION, (color: string, message: string): void => {
      sendNotification(color, message)
    })

    onMounted((): void => {
      if (!localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER]) {
        sendNotification(NOTIFICATION_COLOR.ERROR, 'Server URL not set')
      }

      socket.on(SHARED_EVENTS.SYSTEM_NOTIFICATION, (color: string, message: string): void => {
        sendNotification(color, message)
      })
    })

    return {
      viewComponent
    }
  }
})
</script>

<style>
.v-application {
  background-color: var(--v-background-base) !important;
}

.v-sheet {
  background-color: var(--v-background-darken1) !important;
}

.v-data-table {
  background-color: var(--v-background-darken1) !important;
}

.v-data-table th {
  background-color: var(--v-background-darken1) !important;
}

.v-data-table tr:hover {
  background-color: var(--v-background-darken2) !important;
}

.v-data-table .v-data-table__selected {
  background-color: var(--v-background-darken2) !important;
}

.v-pagination__item {
  background-color: var(--v-background-base) !important;
}

.v-pagination__item:hover {
  background-color: var(--v-background-darken1) !important;
}

.v-pagination__navigation {
  background-color: var(--v-background-base) !important;
}

.v-pagination__navigation:hover {
  background-color: var(--v-background-darken1) !important;
}
</style>
