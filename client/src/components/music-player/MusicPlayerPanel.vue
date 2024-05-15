<template>
  <panel-audio-only-toggle></panel-audio-only-toggle>
  <panel-volume-slider></panel-volume-slider>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import PanelVolumeSlider from '@/components/common/panel/PanelVolumeSlider.vue';
import PanelAudioOnlyToggle from '@/components/common/panel/PanelAudioOnlyToggle.vue';
import { useRouter } from 'vue-router';
import { ROUTES } from '@/plugins/router/constants';

const router = useRouter();

function back() {
  router.push(ROUTES.LOBBY);
}
</script>
