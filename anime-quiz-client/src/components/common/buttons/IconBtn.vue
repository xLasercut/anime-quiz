<template>
  <v-btn :append-icon="icon" :flat="true">
    <slot></slot>
  </v-btn>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    icon: {
      required: true,
      type: String
    }
  }
})
</script>
