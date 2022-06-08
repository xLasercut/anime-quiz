<template>
  <v-toolbar-items>
    <div class="volume-slider-container">
      <v-slider
        prepend-icon="mdi-volume-medium"
        hide-details
        dense
        :min="0"
        :max="100"
        :value="$store.state.client.volume"
        @change="changeVolume($event)"
      ></v-slider>
    </div>
    <nav-btn color="warning" icon="mdi-backspace-reverse-outline" @click="back()">Back</nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import NavBtn from '../shared/buttons/NavBtn.vue'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { ROUTES } from '../../plugins/routing/routes'
import { LOCAL_STORAGE_CONSTANTS } from '../../assets/constants'

export default defineComponent({
  components: { NavBtn },
  setup() {
    function changeVolume(volume: number): void {
      store.commit(MUTATIONS.UPDATE_VOLUME, volume)
      localStorage[LOCAL_STORAGE_CONSTANTS.AQ_VOLUME] = volume
    }

    function back(): void {
      store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOBBY)
    }

    return {
      back,
      changeVolume
    }
  }
})
</script>

<style scoped>
.volume-slider-container {
  width: 150px;
  padding-top: 5px;
}
</style>
