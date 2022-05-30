<template>
  <v-card-text>
    {{ $store.state.game.currentSong }}
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import DialogActions from '../shared/dialog/DialogActions.vue'
import DialogSlider from '../shared/dialog/DialogSlider.vue'
import DialogSelect from '../shared/dialog/DialogSelect.vue'

export default defineComponent({
  components: { DialogSelect, DialogSlider, DialogActions },
  setup(_props, context) {

  }
})
</script>
