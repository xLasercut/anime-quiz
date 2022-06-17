<template>
  <v-btn fab depressed @click="$emit('click')" v-bind="$attrs">
    <v-icon>{{ icon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    }
  }
});
</script>
