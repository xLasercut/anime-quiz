<template>
  <v-col cols="12" align-self="center" class="loading-container" v-if="show">
    <v-progress-circular indeterminate :size="100" :width="5" color="primary"></v-progress-circular>
  </v-col>
</template>

<script lang="ts">
  import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
  import {socket} from '@/assets/socket'

  export default defineComponent({
    setup(_props, _context) {
      const state = reactive({
        show: false
      })

      onMounted(() => {
        socket.on('AMQ_START_LOAD', (): void => {
          state.show = true
        })

        socket.on('AMQ_START_COUNTDOWN', (): void => {
          state.show = false
        })

        socket.on('AMQ_RESET', (): void => {
          state.show = false
        })
      })

      return {...toRefs(state)}
    }
  })
</script>

<style scoped>
  .loading-container {
    height: 100%;
  }
</style>
