<template>
  <v-col cols="auto">
    <v-tooltip
      :value="value"
      @input="$emit('input', $event)"
      :color="player.color"
      min-width="160"
      max-width="160"
      top
    >
      <template #activator="{ on }">
        <div class="player-card">
          <player-avatar :avatar="player.avatar" :host="player.host" :admin="player.admin"></player-avatar>
          <v-row justify="center" no-gutters>
            <v-sheet class="player-name">
              {{player.username}}
            </v-sheet>
            <v-sheet class="player-score">
              {{player.score}}
            </v-sheet>
          </v-row>
        </div>
      </template>
      <slot></slot>
    </v-tooltip>
  </v-col>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import PlayerAvatar from '@/components/game/PlayerAvatar.vue'

  export default defineComponent({
    props: {
      value: {
        required: true
      },
      player: {
        required: true
      }
    },
    components: {
      PlayerAvatar
    }
  })
</script>

<style scoped>
  .player-card {
    width: 160px;
    text-align: center;
    margin: 5px;
  }

  .player-name {
    width: 100% ;
    max-width: 150px;
    font-size: 12pt;
    border-radius: 5px;
    word-wrap: break-word;
  }

  .player-score {
    width: 100%;
    max-width: 70px;
    font-size: 12pt;
    border-radius: 0 0 25px 25px;
  }

  .v-tooltip__content {
    word-wrap: break-word;
    font-size: 12pt;
  }
</style>
