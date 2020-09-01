<template>
  <v-col cols="12" align-self="center" class="loading-container" v-if="show">
    <v-progress-circular indeterminate :size="100" :width="5" color="primary"></v-progress-circular>
  </v-col>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'

export default defineComponent({
  props: {
    show: {
      required: true
    }
  }
})
</script>

<style scoped>
.loading-container {
  height: 100%;
  text-align: center;
}
</style>
