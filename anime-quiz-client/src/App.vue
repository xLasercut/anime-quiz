<template>
  <v-app :theme="theme">
    <nav-bar></nav-bar>
    <v-container fluid>
      <component :is="viewComponent()"></component>
    </v-container>
    <system-notification></system-notification>
  </v-app>
</template>

<script setup lang="ts">
import NavBar from './app/NavBar.vue'
import {computed, onMounted, onUnmounted, provide} from 'vue'
import {useStore} from 'vuex'
import {viewComponent} from './plugins/routing/mapping'
import SystemNotification from './app/SystemNotification.vue'
import {NotificationColor} from './assets/shared/types'
import {SHARED_EVENTS} from './assets/shared/events'
import {socket} from './assets/socket'
import {CLIENT_EVENTS} from './assets/events'

const store = useStore()

const theme = computed((): string => {
  if (store.state.client.darkTheme) {
    return 'nordDark'
  }
  return 'nordLight'
})

let _sendNotification: Function
provide(CLIENT_EVENTS.REGISTER_SEND_NOTIFICATION, (sendNotification: Function): void => {
  _sendNotification = sendNotification
})

provide(SHARED_EVENTS.SYSTEM_NOTIFICATION, (color: NotificationColor, message: string): void => {
  _sendNotification(color, message)
})

onMounted((): void => {
  socket.on(SHARED_EVENTS.SYSTEM_NOTIFICATION, (color: NotificationColor, message: string): void => {
    _sendNotification(color, message)
  })
})

onUnmounted((): void => {
  socket.off(SHARED_EVENTS.SYSTEM_NOTIFICATION)
})
</script>

