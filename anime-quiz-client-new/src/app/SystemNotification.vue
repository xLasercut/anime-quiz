<template>
  <v-snackbar :timeout="6000" :color="state.color" top v-model="state.show">
    {{ state.message }}
    <template #actions>
      <v-btn
        :icon="true"
        text
        size="x-small"
        @click="state.show = false"
      >
        <v-icon icon="mdi-close"></v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import {inject, reactive} from 'vue'
import {NotificationColor} from '../assets/shared/types'
import {CLIENT_EVENTS} from '../assets/events'

const state = reactive({
  message: '',
  show: false,
  color: 'error'
})

function _showNotification(color: NotificationColor, message: string): void {
  state.color = color
  state.message = message
  state.show = true
}

function sendNotification(color: NotificationColor, message: string): void {
  if (state.show) {
    state.show = false
    setTimeout((): void => {
      _showNotification(color, message)
    }, 100)
  } else {
    _showNotification(color, message)
  }
}

const registerSendNotification = inject<Function>(CLIENT_EVENTS.REGISTER_SEND_NOTIFICATION)
if (registerSendNotification) {
  registerSendNotification(sendNotification)
}
</script>
