<template>
  <v-col cols="12" sm="3" class="info-container">
    <v-card flat>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>Title</v-list-item-title>
          <v-list-item-subtitle>{{songInfo('title')}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>Artist</v-list-item-title>
          <v-list-item-subtitle>{{songInfo('artist')}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>Type</v-list-item-title>
          <v-list-item-subtitle>{{songInfo('type')}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-col>
</template>

<script lang="ts">
  import {defineComponent, onMounted, reactive} from '@vue/composition-api'
  import {socket} from '@/assets/socket'

  export default defineComponent({
    setup(_props, context) {
      const state = reactive({
        show: false
      })

      function songInfo(key: string): string {
        if (state.show) {
          let info = context.root.$store.state.amq.gameState.currentSong[key]
          if (info) {
            return info
          }
          return '...'
        }
        return '?'
      }

      onMounted(() => {
        socket.on('AMQ_NEW_SONG', (): void => {
          state.show = false
        })

        socket.on('AMQ_TIME_UP', (): void => {
          state.show = true
        })
      })

      return {songInfo}
    }
  })
</script>

<style scoped>
  .info-container {
    max-width: 300px;
    text-align: center;
  }
</style>
