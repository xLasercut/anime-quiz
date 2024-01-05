<template>
  <v-col cols="5" sm="4">
    <v-card variant="flat" :height="CLIENT_CONSTANTS.PAGE_HEIGHT">
      <v-card-text>
        <div class="chat-message-container">
          <main-game-chat-message v-for="message in messages" :message="message"></main-game-chat-message>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <main-game-chat-input></main-game-chat-input>
    </v-card>
  </v-col>
</template>

<script setup lang="ts">
import { CLIENT_CONSTANTS } from '@/assets/constants';
import MainGameChatInput from '@/components/main-game/main-game-chat/MainGameChatInput.vue';
import { nextTick, onUnmounted, ref } from 'vue';
import { GameChatType } from '@/assets/shared/models/types';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { GameChat } from '@/assets/shared/models/game';
import MainGameChatMessage from '@/components/main-game/main-game-chat/MainGameChatMessage.vue';

const messages = ref<GameChatType[]>([]);

socket.on(SOCKET_EVENTS.UPDATE_GAME_CHAT, (_chat: GameChatType) => {
  const chat = GameChat.parse(_chat);
  if (messages.value.length > 100) {
    messages.value.splice(0, 1);
  }

  if (messages.value.length > 0 && chat.userId === messages.value[messages.value.length - 1].userId) {
    chat.repeat = true;
  }

  messages.value.push(chat);

  nextTick(() => {
    const element = document.querySelector('.chat-message-container');
    if (element) {
      element.scrollTop = element.scrollHeight - element.clientHeight;
    }
  });
});

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.UPDATE_GAME_CHAT);
});
</script>

<style scoped>
.chat-message-container {
  height: calc(100vh - 285px);
  overflow: auto;
  word-wrap: break-word;
}
</style>
