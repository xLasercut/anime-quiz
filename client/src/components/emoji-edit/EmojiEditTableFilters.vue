<template>
  <v-row :dense="true">
    <table-filter-text-field :model-value="emojiId" @update:model-value="updateEmojiId($event)" label="Emoji ID"></table-filter-text-field>
    <table-filter-text-field :model-value="command" @update:model-value="updateCommand($event)" label="Command"></table-filter-text-field>
    <table-filter-select
      :items="emojiTypes"
      :model-value="type"
      @update:model-value="updateType($event)"
      label="Type"
    ></table-filter-select>
  </v-row>
</template>

<script setup lang="ts">
import TableFilterTextField from '@/components/common/tables/TableFilterTextField.vue';
import TableFilterSelect from '@/components/common/tables/TableFilterSelect.vue';
import { debounce } from '@/assets/game-helpers';
import { PropType } from 'vue';

defineProps({
  emojiId: {
    required: true,
    type: String
  },
  command: {
    required: true,
    type: String
  },
  type: {
    required: true,
    type: Object as PropType<string[]>
  }
});

const emit = defineEmits(['update:emoji-id', 'update:command', 'update:type']);

const emojiTypes = ['img', 'dec'];

const updateEmojiId = debounce((val: string) => {
  emit('update:emoji-id', val);
}, 100);

const updateCommand = debounce((val: string) => {
  emit('update:command', val);
}, 100);

function updateType(val: string[]) {
  emit('update:type', val);
}
</script>
