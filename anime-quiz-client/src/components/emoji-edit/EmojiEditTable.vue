<template>
  {{ filteredEmojiList() }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { EmojiType } from '@/assets/shared/models/types';

export default defineComponent({
  setup() {
    const dataStore = useDataStore();

    function filteredEmojiList(): EmojiType[] {
      return dataStore.emojiList;
    }

    return { filteredEmojiList };
  }
});
</script>
