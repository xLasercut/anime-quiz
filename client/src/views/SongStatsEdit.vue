<template>
  <v-card variant="flat">
    <song-stats-edit-table></song-stats-edit-table>
  </v-card>
</template>

<script setup lang="ts">
import SongStatsEditTable from '@/components/song-stats-edit/SongStatsEditTable.vue';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources';
import { socket } from '@/plugins/socket';

socket.emit(SOCKET_EVENTS.UPDATE_STORE_SONG_STATS_RECORDS);
</script>
