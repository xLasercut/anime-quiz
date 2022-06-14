<template>
  <v-tooltip top color="background darken-2">
    <template #activator="{ on }">
      <v-sheet class="answer-container" v-on="on">
        {{ $store.state.game.currentSong.anime_name[0] }}
      </v-sheet>
    </template>
    <v-list dense color="background darken-2">
      <v-list-item v-for="name in $store.state.game.currentSong.anime_name" :key="name">
        {{ name }}
      </v-list-item>
    </v-list>
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({})
</script>

<style scoped>
.answer-container {
  font-size: 16pt;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
}
</style>
