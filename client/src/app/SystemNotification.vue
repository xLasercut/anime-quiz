<template>
  <v-snackbar :timeout="6000" :color="color" top v-model="show">
    {{ message }}
    <template #action="{attrs}">
      <v-btn icon text small @click="show = false">
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, reactive, toRefs} from '@vue/composition-api'
import {IBannerColor} from '../../../shared/types/game'
import {socket} from '@/assets/socket'
import {EventBus} from '@/assets/event'

export default defineComponent({
  setup(_props, _context) {

    const state = reactive({
      show: false,
      message: '',
      color: 'error'
    })

    function showNotification(color: IBannerColor, message: string): void {
      state.color = color
      state.message = message
      state.show = true
    }

    socket.on('SYSTEM_NOTIFICATION', (color: IBannerColor, message: string): void => {
      if (state.show) {
        state.show = false
        setTimeout((): void => {
          showNotification(color, message)
        }, 100)
      }
      else {
        showNotification(color, message)
      }
    })

    EventBus.$on('SYSTEM_NOTIFICATION', (color: IBannerColor, message: string): void => {
      if (state.show) {
        state.show = false
        setTimeout((): void => {
          showNotification(color, message)
        }, 100)
      }
      else {
        showNotification(color, message)
      }
    })

    onUnmounted(() => {
      socket.off('SYSTEM_NOTIFICATION')
    })

    return {...toRefs(state)}
  }
})
</script>
