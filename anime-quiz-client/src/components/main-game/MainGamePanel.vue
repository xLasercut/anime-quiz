<template>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import { ROUTES } from '@/assets/routing/routes';

const clientStore = useClientStore();

function back() {
  clientStore.changeView(ROUTES.GAME_ROOMS);
}
</script>
