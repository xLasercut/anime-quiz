<template>
  <v-card-text>
    <v-row justify="center">
      <v-col cols="auto">
        {{ $store.state.game.currentSong }}
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <icon-btn @click="reloadSongDb()" color="warning" icon="mdi-reload">Reload Song DB</icon-btn>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import DialogActions from '../shared/dialog/DialogActions.vue'
import DialogSlider from '../shared/dialog/DialogSlider.vue'
import DialogSelect from '../shared/dialog/DialogSelect.vue'
import IconBtn from '../shared/buttons/IconBtn.vue'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { socket } from '../../plugins/socket'

export default defineComponent({
  components: { IconBtn, DialogSelect, DialogSlider, DialogActions },
  setup() {
    function reloadSongDb(): void {
      socket.emit(SHARED_EVENTS.ADMIN_RELOAD_SONG_DB)
    }

    return {
      reloadSongDb
    }
  }
})
</script>
