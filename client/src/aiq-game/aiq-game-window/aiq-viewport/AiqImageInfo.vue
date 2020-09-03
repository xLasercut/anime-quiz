<template>
  <v-col cols="12" sm="3" class="info-container" v-show="show">
    <v-card flat>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>Name</v-list-item-title>
          <v-list-item-subtitle>{{ $store.state.aiq.gameState.currentImage.name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, reactive, toRefs} from '@vue/composition-api'
import {socket} from '@/assets/socket'

export default defineComponent({
  setup(_props, _context) {
    const state = reactive({
      show: false
    })

    socket.on('AIQ_NEW_IMAGE', (): void => {
      state.show = false
    })

    socket.on('AIQ_TIME_UP', (): void => {
      state.show = true
    })

    socket.on('AIQ_RESET', (): void => {
      state.show = false
    })

    onUnmounted(() => {
      socket.off('AIQ_NEW_IMAGE')
      socket.off('AIQ_TIME_UP')
      socket.off('AIQ_RESET')
    })

    return {...toRefs(state)}
  }
})
</script>
