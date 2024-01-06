<template>
  <v-card variant="flat">
    <bot-message-edit-table></bot-message-edit-table>
  </v-card>
</template>

<script setup lang="ts">
import BotMessageEditTable from '@/components/bot-message-edit/BotMessageEditTable.vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';

socket.emit(SOCKET_EVENTS.UPDATE_STORE_BOT_MESSAGE_LIST);
</script>
