<template>
  <v-col cols="12" sm="3">
    <player-tools-skip-song></player-tools-skip-song>
    <v-row :dense="true">
      <v-col cols="auto">
        <h4>Life Lines:</h4>
      </v-col>
    </v-row>
    <player-tools-anime-hint></player-tools-anime-hint>
    <player-tools-song-hint></player-tools-song-hint>
  </v-col>
</template>

<script setup lang="ts">
import PlayerToolsSkipSong from '@/components/main-game/main-game-window/main-game-window-viewport/main-game-player-tools/PlayerToolsSkipSong.vue';
import PlayerToolsAnimeHint from '@/components/main-game/main-game-window/main-game-window-viewport/main-game-player-tools/PlayerToolsAnimeHint.vue';
import PlayerToolsSongHint from '@/components/main-game/main-game-window/main-game-window-viewport/main-game-player-tools/PlayerToolsSongHint.vue';
</script>
