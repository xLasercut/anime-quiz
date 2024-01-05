<template>
  <nav-btn icon="mdi-cog" color="primary" @click="openSettings()">Settings</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { CLIENT_EVENTS } from '@/assets/events';
import { OpenDialog } from '@/assets/types';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { inject } from 'vue';

const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as OpenDialog;

function openSettings() {
  openDialog(DIALOG_ROUTES.LOGIN_SETTINGS, 'Settings');
}
</script>
