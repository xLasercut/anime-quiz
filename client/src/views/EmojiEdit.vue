<template>
  <v-main>
    <v-card flat>
      <emoji-edit-table></emoji-edit-table>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { socket } from '../plugins/socket';
import { SHARED_EVENTS } from 'anime-quiz-server/src/shared/events';
import EmojiEditTable from '../components/emoji-edit/EmojiEditTable.vue';

export default defineComponent({
  components: { EmojiEditTable },
  setup() {
    socket.emit(SHARED_EVENTS.JOIN_EMOJI_EDIT);
  }
});
</script>
