<template>
  <v-main>
    <v-row justify="center" no-gutters>
      <v-col cols="6">
        <v-row justify="center">
          <lobby-card v-for="card in gameCards" :card="card" :key="card.key" @join:room="joinGameRoom($event)"></lobby-card>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row justify="center">
          <lobby-card v-for="card in nonGameCards" :card="card" :key="card.key" @join:room="joinNonGameRoom($event)"></lobby-card>
        </v-row>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
import {leaveAllRooms, socket} from '@/assets/socket'
import LobbyCard from '@/lobby/LobbyCard.vue'
import {ILobbyCard} from '@/assets/interfaces'

interface IState {
  gameCards: Array<ILobbyCard>
  nonGameCards: Array<ILobbyCard>
}


export default defineComponent({
  components: {
    LobbyCard
  },
  setup(_props, context) {
    const state = reactive<IState>({
      gameCards: [
        {
          key: 'amq-game',
          icon: 'mdi-gamepad-variant',
          label: 'AMQ Game Room',
          description: 'Play AMQ',
          color: 'success',
          command: 'amq_game',
          isAdmin: false
        },
        {
          key: 'awq-game',
          icon: 'mdi-rocket-launch',
          label: 'AWQ Game Room',
          description: 'Play AWQ',
          color: 'success',
          command: null,
          isAdmin: false
        }
      ],
      nonGameCards: [
        {
          key: 'amq-song',
          icon: 'mdi-playlist-music',
          label: 'AMQ Song List',
          description: 'Edit your AMQ song list',
          color: 'primary',
          command: 'amq_song',
          isAdmin: false
        },
        {
          key: 'awq-weapon',
          icon: 'mdi-chemical-weapon',
          label: 'AWQ Weapon List',
          description: 'Add/Edit AWQ weapon list',
          color: 'error',
          command: 'awq_weapon',
          isAdmin: false
        },
        {
          key: 'emoji',
          icon: 'mdi-sticker-emoji',
          label: 'Emoji',
          description: 'Add/Edit chat emojis',
          color: 'warning',
          command: 'emoji',
          isAdmin: false
        },
        {
          key: 'chat-bot',
          icon: 'mdi-robot',
          label: 'Chat Bot',
          description: 'Add/Edit chat bot responses',
          color: 'info',
          command: 'chat_bot',
          isAdmin: true
        }
      ]
    })

    function joinNonGameRoom(command: string): void {
      socket.emit(`JOIN_${command.toUpperCase()}`)
      context.root.$store.commit('UPDATE_VIEW', command)
    }

    function joinGameRoom(command: string): void {
      context.root.$store.commit('UPDATE_VIEW', `${command}_room_list`)
    }

    onMounted(() => {
      leaveAllRooms()
    })

    return {...toRefs(state), joinNonGameRoom, joinGameRoom}
  }
})
</script>


