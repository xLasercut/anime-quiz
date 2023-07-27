<template>
  <v-menu location="top" :open-on-hover="true" :open-delay="0" :close-delay="0">
    <template #activator="{ props }">
      <v-chip v-bind="props" small color="primary">{{ song.animeName[0] }}</v-chip>
    </template>
    <v-list density="compact">
      <v-list-item v-for="name in song.animeName" :title="name" density="compact"> </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { SongType } from '@/assets/shared/models/types';

export default defineComponent({
  props: {
    song: {
      type: Object as PropType<SongType>,
      required: true
    }
  }
});
</script>
