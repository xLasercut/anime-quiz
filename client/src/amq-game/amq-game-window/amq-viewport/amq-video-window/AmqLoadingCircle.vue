<template>
  <game-loading-circle :show="show"></game-loading-circle>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, reactive, toRefs} from '@vue/composition-api'
import {socket} from '@/assets/socket'
import GameLoadingCircle from '@/components/game/GameLoadingCircle.vue'

export default defineComponent({
  components: {
    GameLoadingCircle
  },
  setup(_props, _context) {
    const state = reactive({
      show: false
    })

    socket.on('AMQ_START_LOAD', (): void => {
      state.show = true
    })

    socket.on('AMQ_START_COUNTDOWN', (): void => {
      state.show = false
    })

    socket.on('AMQ_RESET', (): void => {
      state.show = false
    })

    onUnmounted(() => {
      socket.off('AMQ_START_LOAD')
      socket.off('AMQ_START_COUNTDOWN')
      socket.off('AMQ_RESET')
    })

    return {...toRefs(state)}
  }
})
</script>
