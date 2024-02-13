<template>
  <panel-audio-only-toggle></panel-audio-only-toggle>
  <panel-volume-slider></panel-volume-slider>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import PanelVolumeSlider from '@/components/common/panel/PanelVolumeSlider.vue';
import { useClientStore } from '@/plugins/store/client';
import { ROUTES } from '@/assets/routing/routes';
import PanelAudioOnlyToggle from '@/components/common/panel/PanelAudioOnlyToggle.vue';

const clientStore = useClientStore();

function back() {
  clientStore.changeView(ROUTES.LOBBY);
}
</script>
