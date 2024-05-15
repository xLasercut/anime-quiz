<template>
  <v-toolbar :height="CLIENT_CONSTANTS.NAV_BAR_HEIGHT" :flat="true" color="surface">
    <v-toolbar-items>
      <nav-btn icon="mdi-theme-light-dark" @click="changeTheme()">Theme</nav-btn>
      <nav-btn icon="mdi-shield-crown" color="warning" v-if="clientStore.clientData.admin" @click="openAdminDialog()"> Admin </nav-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <router-view :name="ROUTER_VIEWS.NAV_BAR"></router-view>
      <nav-btn icon="mdi-logout" color="error" @click="logout()" v-if="showLogout()"> Logout</nav-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify';
import { useClientStore } from '@/plugins/store/client';
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { CLIENT_CONSTANTS, LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { socket } from '@/plugins/socket';
import { inject } from 'vue';
import { CLIENT_EVENTS } from '@/assets/events';
import { TOpenDialog } from '@/assets/types';
import { ROUTER_VIEWS, ROUTES } from '@/plugins/router/constants';
import { useRoute, useRouter } from 'vue-router';

const theme = useTheme();
const clientStore = useClientStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as TOpenDialog;
const route = useRoute();
const router = useRouter();

function changeTheme(): void {
  theme.global.name.value = theme.global.name.value === 'dark' ? 'light' : 'dark';
  localStorage[LOCAL_STORAGE_CONSTANTS.DARK_THEME] = theme.global.name.value === 'dark';
}

function logout(): void {
  socket.disconnect();
  router.push({ path: ROUTES.LOGIN, replace: true });
}

function showLogout(): boolean {
  return route.path !== ROUTES.LOGIN;
}

function openAdminDialog() {
  openDialog(DIALOG_ROUTES.ADMIN_PANEL, 'Admin');
}
</script>
