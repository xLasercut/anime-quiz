<template>
  <div class="volume-slider-container">
    <v-slider
      :min="0"
      :max="100"
      :step="1"
      :hide-details="true"
      prepend-icon="mdi-volume-medium"
      density="compact"
      thumb-size="15"
      :model-value="clientStore.volume"
      @update:model-value="updateVolume($event)"
      color="primary"
    ></v-slider>
  </div>
</template>

<script setup lang="ts">
import { useClientStore } from '@/plugins/store/client';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';

const clientStore = useClientStore();

function updateVolume(val: number) {
  localStorage[LOCAL_STORAGE_CONSTANTS.AQ_VOLUME] = val;
  clientStore.updateVolume(val);
}
</script>

<style scoped>
.volume-slider-container {
  width: 150px;
  padding-top: 4px;
}
</style>
