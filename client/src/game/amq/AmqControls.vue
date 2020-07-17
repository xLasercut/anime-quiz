<template>
  <v-toolbar-items>
    <nav-btn icon="mdi-play" color="success" @click="startGame()" v-if="showPlayBtn()"></nav-btn>
    <nav-btn icon="mdi-stop" color="error" @click="stopGame()" v-if="showStopBtn()"></nav-btn>
    <nav-btn icon="mdi-cog" color="info" @click="showSettings()"></nav-btn>
    <game-dialog
      v-model="show"
      :label="dialogTitle"
    >
      <component :is="component" @dialog:close="show = false"></component>
    </game-dialog>
  </v-toolbar-items>
</template>

<script lang="ts">
  import {computed, defineComponent, reactive, toRefs} from '@vue/composition-api'
  import NavBtn from '@/components/buttons/NavBtn.vue'
  import GameDialog from '@/components/GameDialog.vue'
  import AmqSettings from '@/game/amq/amq-controls/AmqSettings.vue'
  import {socket} from '@/assets/socket'

  const componentMap: any = {
    settings: AmqSettings
  }

  export default defineComponent({
    components: {
      NavBtn, GameDialog
    },
    setup(_props, context) {
      const state = reactive({
        show: false,
        dialogTitle: '',
        dialog: ''
      })

      const store = context.root.$store

      function showSettings(): void {
        socket.emit('GET_AMQ_SETTINGS')
        state.dialogTitle = 'AMQ Settings'
        state.dialog = 'settings'
        state.show = true
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

      const component = computed(() => {
        return componentMap[state.dialog]
      })

      return {...toRefs(state), showSettings, component, startGame, stopGame, showPlayBtn, showStopBtn}
    }
  })
</script>
