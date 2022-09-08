<template>
  <v-tooltip top color="background darken-2">
    <template #activator="{ on }">
      <v-chip v-on="on" small color="primary">{{ song.anime_name[0] }}</v-chip>
    </template>
    <v-list dense color="background darken-2">
      <v-list-item v-for="(name, index) in song.anime_name" :key="`${song.song_id}_${index}`">
        {{ name }}
      </v-list-item>
    </v-list>
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { ISong } from '../../assets/shared/interfaces';

export default defineComponent({
  props: {
    song: {
      type: Object as PropType<ISong>,
      required: true
    }
  }
});
</script>
