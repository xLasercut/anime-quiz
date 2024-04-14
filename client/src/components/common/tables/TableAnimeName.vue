<template>
  <v-menu location="top" :open-on-hover="true" :open-delay="0" :close-delay="0" transition="fade-transition">
    <template #activator="{ props }">
      <v-chip :label="true" v-bind="props" size="small" color="primary">{{ song.animeName[0] }}</v-chip>
    </template>
    <v-sheet>
      <v-container :fluid="true">
        <v-row :dense="true" v-for="name in song.animeName">
          <v-col cols="auto">
            {{ name }}
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-menu>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { TCombinedSongStats, TSong } from 'anime-quiz-shared-resources/src/models/types';

defineProps({
  song: {
    type: Object as PropType<TSong | TCombinedSongStats>,
    required: true
  }
});
</script>
