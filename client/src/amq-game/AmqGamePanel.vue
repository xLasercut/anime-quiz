<template>
  <v-toolbar-items>
    <nav-btn icon="mdi-play" color="success" @click="startGame()" v-if="showPlayBtn()"></nav-btn>
    <nav-btn icon="mdi-stop" color="error" @click="stopGame()" v-if="showStopBtn()"></nav-btn>
    <nav-btn icon="mdi-playlist-music" color="primary" @click="showSelector()"
             v-if="$store.state.client.admin"></nav-btn>
    <nav-btn icon="mdi-cog" color="info" @click="showSettings()"></nav-btn>
    <div class="volume-slider-container">
      <v-slider
        prepend-icon="mdi-volume-medium"
        :value="50"
        @change="changeVolume($event)"
        id="game-volume-slider"
      ></v-slider>
    </div>
  </v-toolbar-items>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import NavBtn from '@/components/buttons/NavBtn.vue'
import {socket} from '@/assets/socket'
import {EventBus} from '@/assets/event'

export default defineComponent({
  components: {
    NavBtn
  },
  setup(_props, context) {
    const store = context.root.$store

    function showSettings(): void {
      socket.emit('GET_AMQ_SETTINGS')
      EventBus.$emit('GLOBAL_DIALOG', 'amqSettings', 'AMQ Settings')
    }

    function showSelector(): void {
      EventBus.$emit('GLOBAL_DIALOG', 'amqSelector', 'AMQ Song Select', '800px')
    }

    function startGame(): void {
      socket.emit('START_AMQ_GAME')
    }

    function stopGame(): void {
      socket.emit('STOP_AMQ_GAME')
    }

    function showPlayBtn(): boolean {
      return (!store.state.amq.gameState.playing && (store.state.client.admin || store.state.amq.host))
    }

    function showStopBtn(): boolean {
      return (store.state.amq.gameState.playing && (store.state.client.admin || store.state.amq.host))
    }

    function changeVolume(volume: number): void {
      EventBus.$emit('CHANGE_AMQ_VOLUME', volume)
    }

    return {showSettings, startGame, stopGame, showPlayBtn, showStopBtn, showSelector, changeVolume}
  }
})
</script>

<style scoped>
.volume-slider-container {
  width: 150px;
  padding-top: 15px;
  padding-left: 10px;
}
</style>
