<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-row no-gutters justify="center">
        <v-col cols="5" sm="3" md="2">
          <v-sheet class="song-count-container">
            {{$store.state.amq.gameState.currentSongCount}} / {{$store.state.amq.gameState.maxSongCount}}
          </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters justify="center">
        <v-col cols="12" sm="8" md="6" lg="5">
          <v-sheet class="answer-container">
            {{answer}}
          </v-sheet>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {computed, defineComponent, onMounted, reactive} from '@vue/composition-api'
  import {socket} from '@/assets/socket'

  export default defineComponent({
    setup(_props, context) {
      const state = reactive({
        show: false
      })

      const answer = computed(() => {
        if (state.show) {
          return context.root.$store.state.amq.gameState.currentSong.anime[0]
        }
        return '?'
      })

      onMounted(() => {
        socket.on('AMQ_NEW_SONG', (): void => {
          state.show = false
        })

        socket.on('AMQ_TIME_UP', (): void => {
          state.show = true
        })
      })

      return {answer}
    }
  })
</script>


<style scoped>
  .song-count-container {
    border-radius: 20px 20px 0 0;
    text-align: center;
  }

  .answer-container {
    font-size: 16pt;
    text-align: center;
    border-radius: 5px;
  }
</style>
