<template>
  <v-row :dense="true">
    <table-filter-text-field
      :model-value="messageId"
      @update:model-value="updateMessageId($event)"
      label="Message ID"
    ></table-filter-text-field>
    <table-filter-text-field :model-value="userId" @update:model-value="updateUserId($event)" label="User ID"></table-filter-text-field>
    <table-filter-text-field :model-value="command" @update:model-value="updateCommand($event)" label="Command"></table-filter-text-field>
  </v-row>
</template>

<script setup lang="ts">
import TableFilterTextField from '@/components/common/tables/TableFilterTextField.vue';
import { debounce } from '@/assets/game-helpers';

defineProps({
  messageId: {
    Type: String,
    required: true
  },
  userId: {
    Type: String,
    required: true
  },
  command: {
    Type: String,
    required: true
  }
});

const emit = defineEmits(['update:message-id', 'update:user-id', 'update:command']);

const updateMessageId = debounce((val: string) => {
  emit('update:message-id', val);
}, 100);

const updateUserId = debounce((val: string) => {
  emit('update:user-id', val);
}, 100);

const updateCommand = debounce((val: string) => {
  emit('update:command', val);
}, 100);
</script>
