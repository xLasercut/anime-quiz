<template>
  <v-card-text>
    <v-row justify="center">
      <v-col cols="auto">
        {{ $store.state.game.currentSong }}
      </v-col>
    </v-row>
    <v-row justify="center" no-gutters>
      <v-col cols="12">
        <v-select
          outlined
          label="Kick Player"
          append-outer-icon="mdi-delete"
          v-model="playerToKick"
          :items="$store.state.game.players"
          clearable
          @click:append-outer="kickPlayer()"
        >
          <template #item="{item}">
            <v-list-item-avatar :size="50">
              <game-avatar :size="50" :avatar="item.avatar"></game-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              {{ item.sid }} - {{ item.username }}
            </v-list-item-content>
          </template>

          <template #selection="{item}">
            <v-list-item-avatar :size="50">
              <game-avatar :size="50" :avatar="item.avatar"></game-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              {{ item.sid }} - {{ item.username }}
            </v-list-item-content>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <icon-btn @click="reloadDb()" color="warning" icon="mdi-reload">Reload DB</icon-btn>
      </v-col>
      <v-col cols="auto">
        <icon-btn icon="mdi-lock" color="error" @click="lockDb()">Lock DB</icon-btn>
      </v-col>
      <v-col cols="auto">
        <icon-btn icon="mdi-lock-open" color="success" @click="unlockDb()">Unlock DB</icon-btn>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import IconBtn from '../shared/buttons/IconBtn.vue'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { socket } from '../../plugins/socket'
import GameAvatar from '../shared/GameAvatar.vue'
import { AqGamePlayer } from '../../assets/shared/interfaces'

interface State {
  playerToKick: AqGamePlayer | null
}

export default defineComponent({
  components: { IconBtn, GameAvatar },
  setup() {
    const state = reactive<State>({
      playerToKick: null
    })

    function reloadDb(): void {
      socket.emit(SHARED_EVENTS.ADMIN_RELOAD_DB)
    }

    function kickPlayer(): void {
      if (state.playerToKick && state.playerToKick.sid) {
        socket.emit(SHARED_EVENTS.ADMIN_KICK_PLAYER, state.playerToKick.sid)
      }
    }

    function lockDb(): void {
      socket.emit(SHARED_EVENTS.ADMIN_LOCK_DB)
    }

    function unlockDb(): void {
      socket.emit(SHARED_EVENTS.ADMIN_UNLOCK_DB)
    }

    return {
      reloadDb,
      ...toRefs(state),
      kickPlayer,
      lockDb,
      unlockDb
    }
  }
})
</script>
