<template>
  <v-row :dense="true" justify="space-between">
    <v-col cols="auto">
      <div style="width: 200px">
        <v-select
          label="Operation Type"
          density="compact"
          :hide-details="true"
          variant="outlined"
          :disabled="disabled"
          :items="items"
          :model-value="modelValue"
          @update:model-value="$emit('update:model-value', $event)"
          item-value="value"
          item-title="text"
        ></v-select>
      </div>
    </v-col>
    <v-col cols="auto">
      <icon-btn
        :disabled="modelValue === SONG_LIST_EDIT_MODE.NONE || disabled"
        color="success"
        icon="mdi-check"
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

const items = [
  { text: 'Add Songs', value: SONG_LIST_EDIT_MODE.ADD },
  { text: 'Remove Songs', value: SONG_LIST_EDIT_MODE.REMOVE },
  { text: 'None', value: SONG_LIST_EDIT_MODE.NONE }
];
</script>
