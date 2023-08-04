<template>
  <v-row :dense="true">
    <v-col>
      <v-radio-group
        :disabled="disabled"
        :inline="true"
        :model-value="modelValue"
        @update:model-value="$emit('update:model-value', $event)"
        density="compact"
      >
        <v-radio label="Add Songs" :value="SONG_LIST_EDIT_MODE.ADD"></v-radio>
        <v-radio label="Remove Songs" :value="SONG_LIST_EDIT_MODE.REMOVE"></v-radio>
        <v-radio label="None" :value="SONG_LIST_EDIT_MODE.NONE"></v-radio>
      </v-radio-group>
    </v-col>
    <v-col cols="auto">
      <icon-btn
        :disabled="modelValue === SONG_LIST_EDIT_MODE.NONE || disabled"
        color="success"
        icon="mdi-check"
        size="small"
        @click="$emit('submit:change')"
      >
        Confirm
      </icon-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import { SONG_LIST_EDIT_MODE } from '@/assets/constants';

defineProps({
  disabled: {
    type: Boolean,
    default: (): boolean => {
      return false;
    }
  },
  modelValue: {
    type: String,
    required: true
  }
});
</script>
