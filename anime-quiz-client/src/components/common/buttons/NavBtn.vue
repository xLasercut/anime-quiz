<template>
  <v-btn :append-icon="icon" size="small" density="comfortable">
    <slot></slot>
  </v-btn>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    icon: {
      required: true
    }
  }
})
</script>
