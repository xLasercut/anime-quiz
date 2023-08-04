<template>
  <nav-btn icon="mdi-plus" color="success" @click="newEmoji()">New Emoji</nav-btn>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import { ROUTES } from '@/assets/routing/routes';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { useDataStore } from '@/plugins/store/data';
import { useAdminStore } from '@/plugins/store/admin';
import { injectStrict } from '@/assets/game-helpers';
import { OpenDialog } from '@/assets/types';
import { CLIENT_EVENTS } from '@/assets/events';

const clientStore = useClientStore();
const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = injectStrict<OpenDialog>(CLIENT_EVENTS.OPEN_DIALOG);

function newEmoji() {}

function reload() {
  dataStore.updateEmojiList([]);
  socket.emit(SOCKET_EVENTS.UPDATE_STORE_EMOJI_LIST);
}

function back() {
  clientStore.changeView(ROUTES.LOBBY);
}
</script>
