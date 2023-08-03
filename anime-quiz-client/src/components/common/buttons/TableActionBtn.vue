<template>
  <v-btn density="comfortable" variant="flat">
    <v-icon>{{ icon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    icon: {
      required: true,
      type: String
    }
  }
});
</script>
