<template>
  <v-card variant="flat">
    <user-edit-table></user-edit-table>
  </v-card>
</template>

<script setup lang="ts">
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import UserEditTable from '@/components/user-edit/UserEditTable.vue';

socket.emit(SOCKET_EVENTS.UPDATE_STORE_USER_LIST);
</script>
