<template>
  <v-main>
    <v-row justify="center">
      <v-col cols="auto" v-for="card in cards" :key="card.key" v-if="showCard(card.isAdmin)">
        <div class="card-container">
          <v-card width="250px" flat>
            <v-card-title :class="`${card.color}--text`">
              <v-icon large left :class="`${card.color}--text`">{{ card.icon }}</v-icon>
              <span class="title">{{ card.label }}</span>
            </v-card-title>

            <v-card-text>
              <span>{{ card.description }}</span>
            </v-card-text>

            <v-card-actions>
              <icon-btn icon="mdi-login" :color="card.color" @click="joinRoom(card.command, card.showRoomList)">Start
              </icon-btn>
            </v-card-actions>
            <div>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
import IconBtn from '@/components/buttons/IconBtn.vue'
import {leaveAllRooms, socket} from '@/assets/socket'

export default defineComponent({
  components: {
    IconBtn
  },
  setup(_props, context) {
    const state = reactive({
      cards: [
        {
          key: 'amq-game',
          icon: 'mdi-gamepad-variant',
          label: 'AMQ Game Room',
          description: 'Play AMQ',
          color: 'success',
          command: 'amq_game',
          showRoomList: true,
          isAdmin: false
        },
        {
          key: 'amq-song',
          icon: 'mdi-playlist-music',
          label: 'AMQ Song List',
          description: 'Edit your amq song list',
          color: 'primary',
          command: 'amq_song',
          showRoomList: false,
          isAdmin: false
        },
        {
          key: 'emoji',
          icon: 'mdi-sticker-emoji',
          label: 'Emoji',
          description: 'Add/Edit chat emojis',
          color: 'warning',
          command: 'emoji',
          showRoomList: false,
          isAdmin: false
        },
        {
          key: 'chat-bot',
          icon: 'mdi-robot',
          label: 'Chat Bot',
          description: 'Add/Edit chat bot responses',
          color: 'info',
          command: 'chat_bot',
          showRoomList: false,
          isAdmin: true
        }
      ],
      show: false
    })

    function joinRoom(command: string, showRoomList: boolean): void {
      if (showRoomList) {
        context.root.$store.commit('UPDATE_VIEW', `${command}_room_list`)
      }
      else {
        socket.emit(`JOIN_${command.toUpperCase()}`)
        context.root.$store.commit('UPDATE_VIEW', command)
      }
    }

    function showCard(isAdmin: boolean): boolean {
      if (isAdmin) {
        return context.root.$store.state.client.admin
      }
      return true
    }

    onMounted(() => {
      leaveAllRooms()
    })

    return {...toRefs(state), joinRoom, showCard}
  }
})
</script>


