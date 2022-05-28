<template>
  <v-btn v-bind="$attrs" text tile @click="$emit('click')">
    <slot></slot>
    <v-icon right>{{ icon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    }
  }
})
</script>
