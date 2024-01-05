<template>
  <v-toolbar height="40" :flat="true" color="surface">
    <v-toolbar-items>
      <nav-btn icon="mdi-theme-light-dark" @click="changeTheme()">Theme</nav-btn>
      <nav-btn icon="mdi-shield-crown" color="warning" v-if="clientStore.clientData.admin">Admin</nav-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <component :is="panelComponent()"></component>
      <nav-btn icon="mdi-logout" color="error" @click="logout()" v-if="showLogout()"> Logout</nav-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script setup lang="ts">
import {useTheme} from 'vuetify';
import {PANEL_MAPPING} from '@/assets/routing/mapping';
import {useClientStore} from '@/plugins/store/client';
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import DefaultPanel from '@/components/app/DefaultPanel.vue';
import {LOCAL_STORAGE_CONSTANTS} from '@/assets/constants';
import {ROUTES} from '@/assets/routing/routes';
import {socket} from '@/plugins/socket';


const theme = useTheme();
const clientStore = useClientStore();

function panelComponent() {
  return PANEL_MAPPING[clientStore.view] || DefaultPanel;
}

function changeTheme(): void {
  theme.global.name.value = theme.global.name.value === 'dark' ? 'light' : 'dark';
  localStorage[LOCAL_STORAGE_CONSTANTS.DARK_THEME] = theme.global.name.value === 'dark';
}

function logout(): void {
  socket.disconnect();
}

function showLogout(): boolean {
  return clientStore.view !== ROUTES.LOGIN;
}
</script>
