<template>
  <nav-btn icon="mdi-cog" color="primary" @click="openSettings()">Settings</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import { DIALOG_ROUTES, ROUTES } from '@/assets/routing/routes';
import { inject } from 'vue';
import { CLIENT_EVENTS } from '@/assets/events';
import { OpenDialog } from '@/assets/types';

const clientStore = useClientStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as OpenDialog;

function openSettings() {
  openDialog(DIALOG_ROUTES.MAIN_GAME_SETTINGS, 'Game Settings');
}

function back() {
  clientStore.changeView(ROUTES.GAME_ROOMS);
}
</script>
