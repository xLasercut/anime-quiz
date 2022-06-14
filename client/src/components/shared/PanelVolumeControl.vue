<template>
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
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { LOCAL_STORAGE_CONSTANTS } from '../../assets/constants'

export default defineComponent({
  setup() {
    function changeVolume(volume: number): void {
      store.commit(MUTATIONS.UPDATE_VOLUME, volume)
      localStorage[LOCAL_STORAGE_CONSTANTS.AQ_VOLUME] = volume
    }

    return {
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
