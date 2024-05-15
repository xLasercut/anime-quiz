<template>
  <nav-btn icon="mdi-plus" color="success" @click="newEmoji()">New Emoji</nav-btn>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources';
import { useDataStore } from '@/plugins/store/data';
import { useAdminStore } from '@/plugins/store/admin';
import { TOpenDialog } from '@/assets/types';
import { CLIENT_EVENTS } from '@/assets/events';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import { ROUTES } from '@/plugins/router/constants';

const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as TOpenDialog;
const router = useRouter();

function newEmoji() {
  adminStore.updateEmojiInEdit({
    emojiId: '',
    command: '',
    src: '',
    type: 'img'
  });
  adminStore.generateNewEmojiId();
  adminStore.updateEditMode(DATABASE_EDIT_MODE.NEW);
  openDialog(DIALOG_ROUTES.EMOJI_EDIT, 'New Emoji');
}

function reload() {
  dataStore.updateEmojiList([]);
  socket.emit(SOCKET_EVENTS.UPDATE_STORE_EMOJI_LIST);
}

function back() {
  router.push(ROUTES.LOBBY);
}
</script>
