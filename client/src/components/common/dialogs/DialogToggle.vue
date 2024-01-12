<template>
  <dialog-select v-bind="$attrs" :items="items" item-value="value" item-title="text"></dialog-select>
</template>

<script setup lang="ts">
import DialogSelect from '@/components/common/dialogs/DialogSelect.vue';

const items = [
  { text: 'True', value: true },
  { text: 'False', value: false }
];
</script>
