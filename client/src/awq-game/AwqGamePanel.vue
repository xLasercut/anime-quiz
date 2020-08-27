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

    function showPlayBtn(): boolean {
      return (!store.state.awq.gameState.playing && (store.state.client.admin || store.state.awq.host))
    }

    function showStopBtn(): boolean {
      return (store.state.awq.gameState.playing && (store.state.client.admin || store.state.awq.host))
    }

    function showSettings(): void {
      socket.emit('GET_AWQ_SETTINGS')
      EventBus.$emit('GLOBAL_DIALOG', 'awqSettings', 'AWQ Settings')
    }

    return {showPlayBtn, showStopBtn, showSettings}
  }
})
</script>
