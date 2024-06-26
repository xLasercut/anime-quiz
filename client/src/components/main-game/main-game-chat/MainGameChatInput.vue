<template>
  <v-card-actions>
    <v-menu
      v-model="showEmojiSelect"
      location="top"
      max-height="304px"
      :contained="true"
      :open-on-click="false"
      :open-on-focus="false"
      :open-on-hover="false"
    >
      <template #activator="{ props }">
        <v-textarea
          no-resize
          v-model.trim="message"
          hide-details
          label="Message"
          append-inner-icon="mdi-send"
          variant="filled"
          max-rows="3"
          :clearable="true"
          @click:append-inner="sendMessage()"
          v-bind="props"
          id="chat-input"
          @keydown.enter.prevent="sendMessage()"
        ></v-textarea>
      </template>
      <v-list>
        <v-list-item v-for="emoji in emojiChoices" :value="emoji.command" @click="addEmoji(emoji.command)">
          <template #prepend>
            <game-emoji :emoji="emoji"></game-emoji>
          </template>
          <v-list-item-title>{{ `:${emoji.command}:` }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card-actions>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { SOCKET_EVENTS, TEmoji, TEmojiCommand } from 'anime-quiz-shared-resources';
import GameEmoji from '@/components/common/GameEmoji.vue';
import { socket } from '@/plugins/socket';

const EMOJI_CHAT_FORMAT = new RegExp('(:)(?:[^:]+)$', 'ig');
const dataStore = useDataStore();

const message = ref('');
const showEmojiSelect = ref(false);
const emojiChoices = ref<TEmoji[]>(dataStore.emojiList);
const emojiChoicesOldLength = ref(0);

watch(
  () => message.value,
  (val: string) => {
    if (!val) {
      showEmojiSelect.value = false;
      return;
    }

    const match = val.match(EMOJI_CHAT_FORMAT);
    if (!match) {
      showEmojiSelect.value = false;
      return;
    }

    const command = match[0];
    emojiChoices.value = dataStore.emojiList.filter((emoji: TEmoji) => {
      return `:${emoji.command.toLowerCase()}:`.includes(command.toLowerCase());
    });
    const currentLength = emojiChoices.value.length;
    if (currentLength === 0) {
      showEmojiSelect.value = false;
      return;
    }

    if (currentLength !== emojiChoicesOldLength.value) {
      emojiChoicesOldLength.value = currentLength;
      showEmojiSelect.value = false;
      nextTick(() => {
        showEmojiSelect.value = true;
      });
      return;
    }
    showEmojiSelect.value = true;
  }
);

function addEmoji(command: TEmojiCommand) {
  message.value = message.value.replace(EMOJI_CHAT_FORMAT, `:${command}:`);
  emojiChoicesOldLength.value = 0;
  showEmojiSelect.value = false;
  document.getElementById('chat-input')?.focus();
}

function sendMessage() {
  if (message.value) {
    socket.emit(SOCKET_EVENTS.SEND_GAME_CHAT, message.value);
    message.value = '';
  }
}
</script>
