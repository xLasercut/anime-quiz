<template>
  <v-row :dense="true">
    <v-col cols="auto">
      <table-action-btn icon="mdi-movie-open-play" color="primary" @click="openVideo()"></table-action-btn>
    </v-col>
    <v-col cols="auto">
      <table-action-btn icon="mdi-music-box" color="info" @click="openMusic()" v-if="song.audioSrc"></table-action-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { inject, PropType } from 'vue';
import { TSong } from 'anime-quiz-shared-resources';
import TableActionBtn from '@/components/common/buttons/TableActionBtn.vue';
import { CLIENT_EVENTS } from '@/assets/events';
import { TOpenDialog } from '@/assets/types';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { useClientStore } from '@/plugins/store/client';

const clientStore = useClientStore();

const props = defineProps({
  song: {
    required: true,
    type: Object as PropType<TSong>
  }
});

const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as TOpenDialog;

function openVideo() {
  clientStore.setMediaPreviewSrc(props.song.src);
  openDialog(DIALOG_ROUTES.VIDEO_PLAYER, 'Preview video');
}

function openMusic() {
  clientStore.setMediaPreviewSrc(props.song?.audioSrc || '');
  openDialog(DIALOG_ROUTES.VIDEO_PLAYER, 'Preview music');
}
</script>
