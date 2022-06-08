<template>
  <v-card-text>
    <v-form v-model="valid" @submit.prevent="setSettings()">
      <v-container fluid>
        <dialog-slider
          label="Song Count"
          v-model.number="songCount"
          :min="1"
          :max="100"
          :disabled="disabled()"
        ></dialog-slider>
        <dialog-slider
          label="Guess Time"
          v-model.number="guessTime"
          :min="20"
          :max="100"
          :disabled="disabled()"
        ></dialog-slider>
        <dialog-select
          label="Game Mode"
          :items="gameModes"
          v-model="gameMode"
          :disabled="disabled()"
        ></dialog-select>
        <dialog-select
          label="Duplicate"
          :items="toggleItems"
          v-model="duplicate"
          :disabled="disabled()"
        ></dialog-select>
        <dialog-select
          label="User Lists"
          :items="$store.state.data.userLists"
          item-text="username"
          item-value="user_id"
          multiple
          v-model="users"
          :disabled="disabled()"
        ></dialog-select>
        <dialog-actions :disabled="disabled()" @dialog:close="$emit('dialog:close')"></dialog-actions>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, toRefs } from '@vue/composition-api'
import DialogActions from '../shared/dialog/DialogActions.vue'
import DialogSlider from '../shared/dialog/DialogSlider.vue'
import DialogSelect from '../shared/dialog/DialogSelect.vue'
import { GAME_MODE } from '../../assets/shared/constants'
import { socket } from '../../plugins/socket'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { AqGameSettings } from '../../assets/shared/interfaces'
import { store } from '../../plugins/store'
import { newTableHelpers } from '../../assets/table-helper'
import { MUTATIONS } from '../../plugins/store/mutations'

interface GameModeItem {
  text: string
  value: string
}

interface ToggleItem {
  text: string
  value: boolean
}

interface State {
  valid: boolean
  songCount: number
  guessTime: number
  gameMode: string
  duplicate: boolean
  users: string[]
  gameModes: GameModeItem[]
  toggleItems: ToggleItem[]
}

export default defineComponent({
  components: { DialogSelect, DialogSlider, DialogActions },
  setup(_props, context) {
    const state = reactive<State>({
      valid: false,
      songCount: 20,
      guessTime: 30,
      gameMode: GAME_MODE.NORMAL,
      duplicate: false,
      users: [],
      gameModes: [
        { text: 'Normal', value: GAME_MODE.NORMAL },
        { text: 'Balanced', value: GAME_MODE.BALANCED },
        { text: 'Balanced Plus', value: GAME_MODE.BALANCED_PLUS },
        { text: 'Shiritori', value: GAME_MODE.SHIRITORI }
      ],
      toggleItems: [
        { text: 'Yes', value: true },
        { text: 'No', value: false }
      ]
    })

    function setSettings() {
      if (state.valid) {
        store.commit(MUTATIONS.EDIT_DISABLE_GAME_SETTINGS, true)
        const settings: AqGameSettings = {
          songCount: state.songCount,
          guessTime: state.guessTime,
          gameMode: state.gameMode,
          duplicate: state.duplicate,
          users: state.users
        }
        socket.emit(SHARED_EVENTS.EDIT_GAME_SETTINGS, settings, (proceed: boolean) => {
          if (proceed) {
            context.emit('dialog:close')
          }
          store.commit(MUTATIONS.EDIT_DISABLE_GAME_SETTINGS, false)
        })
      }
    }

    socket.on(SHARED_EVENTS.UPDATE_GAME_SETTINGS, (settings: AqGameSettings) => {
      state.songCount = settings.songCount
      state.guessTime = settings.guessTime
      state.gameMode = settings.gameMode
      state.duplicate = settings.duplicate
      state.users = settings.users
      store.commit(MUTATIONS.EDIT_DISABLE_GAME_SETTINGS, false)
    })

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.UPDATE_GAME_SETTINGS)
    })

    function disabled(): boolean {
      if (store.state.game.playing || store.state.game.disableSettings) {
        return true
      }
      return !store.state.client.admin && !store.state.client.host
    }

    return {
      ...toRefs(state),
      setSettings,
      disabled
    }
  }
})
</script>
