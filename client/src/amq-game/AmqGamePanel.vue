<template>
  <v-toolbar-items>
    <nav-btn icon="mdi-play" color="success" @click="startGame()" v-if="showPlayBtn()"></nav-btn>
    <nav-btn icon="mdi-stop" color="error" @click="stopGame()" v-if="showStopBtn()"></nav-btn>
    <nav-btn icon="mdi-playlist-music" color="primary" @click="showSelector()"
             v-if="$store.state.client.admin"></nav-btn>
    <nav-btn icon="mdi-cog" color="info" @click="showSettings()"></nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import {defineComponent, toRefs} from '@vue/composition-api'
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

    return {showSettings, startGame, stopGame, showPlayBtn, showStopBtn, showSelector}
  }
})
</script>
