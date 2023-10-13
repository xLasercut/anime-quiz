<template>
  <v-row :dense="true">
    <main-game-window></main-game-window>
    <main-game-chat></main-game-chat>
  </v-row>
</template>

<script setup lang="ts">
import MainGameChat from '@/components/main-game/MainGameChat.vue';
import MainGameWindow from "@/components/main-game/MainGameWindow.vue";
</script>
