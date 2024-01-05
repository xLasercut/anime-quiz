<template>
  <v-container :fluid="true">
    <v-row justify="center" :dense="true">
      <v-col cols="auto"> Client Version: {{ CLIENT_VERSION }}</v-col>
    </v-row>
    <admin-dialog-database-config></admin-dialog-database-config>
    <admin-dialog-kick-player></admin-dialog-kick-player>
    <admin-dialog-current-song></admin-dialog-current-song>
  </v-container>
</template>

<script setup lang="ts">
import { CLIENT_VERSION } from '@/assets/constants';
import AdminDialogKickPlayer from '@/components/app/admin-dialog/AdminDialogKickPlayer.vue';
import AdminDialogDatabaseConfig from '@/components/app/admin-dialog/AdminDialogDatabaseConfig.vue';
import AdminDialogCurrentSong from '@/components/app/admin-dialog/AdminDialogCurrentSong.vue';
</script>
