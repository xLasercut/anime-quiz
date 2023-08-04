<template>
  <v-row justify="end" :dense="true">
    <v-col cols="auto">
      <icon-btn :disabled="disabled" color="error" density="comfortable" @click="$emit('dialog:close')" icon="mdi-close"> Cancel </icon-btn>
    </v-col>
    <v-col cols="auto">
      <icon-btn :disabled="disabled" icon="mdi-check" color="success" type="submit" density="comfortable"> Confirm </icon-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import IconBtn from '@/components/common/buttons/IconBtn.vue';

defineProps({
  disabled: {
    type: Boolean,
    default: (): boolean => {
      return false;
    }
  }
});
</script>
