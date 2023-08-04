<template>
  <nav-btn icon="mdi-cog" color="primary" @click="openSettings()">Settings</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { CLIENT_EVENTS } from '@/assets/events';
import { OpenDialog } from '@/assets/types';
import { injectStrict } from '@/assets/game-helpers';
import { DIALOG_ROUTES } from '@/assets/routing/routes';

const openDialog = injectStrict<OpenDialog>(CLIENT_EVENTS.OPEN_DIALOG);

function openSettings() {
  openDialog(DIALOG_ROUTES.LOGIN_SETTINGS, 'Settings');
}
</script>
