<template>
  <v-card variant="flat">
    <emoji-edit-table></emoji-edit-table>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EmojiEditTable from '@/components/emoji-edit/EmojiEditTable.vue';

export default defineComponent({
  components: { EmojiEditTable }
});
</script>
