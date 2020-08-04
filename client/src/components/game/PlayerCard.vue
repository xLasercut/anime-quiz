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
          <v-row justify="center" no-gutters v-if="$store.state.client.admin && !player.admin">
            <v-col cols="auto">
              <avatar-btn icon="mdi-delete" color="error" @click="kickPlayer(player.socketId)"></avatar-btn>
            </v-col>
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
  import AvatarBtn from '@/components/buttons/AvatarBtn.vue'
  import {socket} from '@/assets/socket'

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
      PlayerAvatar, AvatarBtn
    },
    setup(_props, _context) {
      function kickPlayer(socketId: string) {
        socket.emit('ADMIN_KICK_PLAYER', socketId)
      }

      return {kickPlayer}
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
