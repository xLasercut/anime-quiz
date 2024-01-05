<template>
  <v-row :dense="true">
    <table-filter-text-field
      label="Discord ID"
      :model-value="discordId"
      @update:model-value="updateDiscordId($event)"
    ></table-filter-text-field>
    <table-filter-text-field label="User ID" :model-value="userId" @update:model-value="updateUserId($event)"></table-filter-text-field>
    <table-filter-text-field
      label="Display Name"
      :model-value="displayName"
      @update:model-value="updateDisplayName($event)"
    ></table-filter-text-field>
  </v-row>
</template>

<script setup lang="ts">
import TableFilterTextField from '@/components/common/tables/TableFilterTextField.vue';
import { debounce } from '@/assets/game-helpers';

defineProps({
  discordId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:discord-id', 'update:user-id', 'update:display-name']);

const updateDiscordId = debounce((val: string) => {
  emit('update:discord-id', val);
}, 100);

const updateUserId = debounce((val: string) => {
  emit('update:user-id', val);
}, 100);

const updateDisplayName = debounce((val: string) => {
  emit('update:display-name', val);
}, 100);
</script>
