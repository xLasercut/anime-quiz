<template>
  <v-progress-circular :size="100" :width="5" indeterminate color="primary" v-show="show">
  </v-progress-circular>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, toRefs } from '@vue/composition-api'
import { socket } from '../../../../../plugins/socket'
import { SHARED_EVENTS } from '../../../../../assets/shared/events'

export default defineComponent({
  setup() {
    const state = reactive({
      show: false
    })

    socket.on(SHARED_EVENTS.GAME_START_LOAD, () => {
      state.show = true
    })

    socket.on(SHARED_EVENTS.GAME_START_COUNTDOWN, () => {
      state.show = false
    })

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.GAME_START_LOAD)
      socket.off(SHARED_EVENTS.GAME_START_COUNTDOWN)
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>
