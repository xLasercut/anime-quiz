<template>
  <v-main>
    <v-row justify="center">
      <v-col cols="auto">
        <icon-btn icon="mdi-plus" color="success" @click="show = true">New Room</icon-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto" v-for="room in $store.state.amq.roomList" :key="room.roomId">
        <room-card :room="room" @room:join="joinRoom($event)"></room-card>
      </v-col>
    </v-row>
    <game-dialog v-model="show" label="New AMQ Room">
      <v-form v-model="valid" @submit.prevent="newRoom()">
        <v-row justify="center" dense>
          <dialog-text
            v-model.trim="roomName" label="Room Name"
            counter="20"
            :rules="rules"
          ></dialog-text>
          <dialog-confirm-btn :disabled="!valid"></dialog-confirm-btn>
        </v-row>
      </v-form>
    </game-dialog>
  </v-main>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
import IconBtn from '@/components/buttons/IconBtn.vue'
import GameDialog from '@/components/GameDialog.vue'
import DialogText from '@/components/dialog/DialogText.vue'
import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'
import {NAME_FORMAT} from '@/assets/config/formats'
import {leaveAllRooms, socket} from '@/assets/socket'
import RoomCard from '@/components/game/RoomCard.vue'

export default defineComponent({
  components: {
    IconBtn, GameDialog, DialogText, DialogConfirmBtn, RoomCard
  },
  setup(_props, context) {
    const state = reactive({
      show: false,
      valid: false,
      roomName: '',
      rules: [
        (v: string): boolean | string => (!!v) || 'Room name required',
        (v: string): boolean | string => NAME_FORMAT.test(v) || 'Room name can only contain: 0-9, A-Z, a-z and space',
        (v: string): boolean | string => (v && v.length <= 20) || 'Room name must be under 20 characters'
      ]
    })

    function newRoom(): void {
      if (state.show && state.valid) {
        socket.emit(
          'JOIN_AMQ_GAME_NEW',
          state.roomName,
          context.root.$store.state.client.username,
          context.root.$store.state.client.avatar
        )
        context.root.$store.commit('UPDATE_VIEW', 'amq_game')
      }

    }

    function joinRoom(roomId: string): void {
      socket.emit(
        'JOIN_AMQ_GAME_EXIST',
        roomId,
        context.root.$store.state.client.username,
        context.root.$store.state.client.avatar
      )
      context.root.$store.commit('UPDATE_VIEW', 'amq_game')
    }

    onMounted(() => {
      leaveAllRooms()
      socket.emit('GET_AMQ_ROOM_LIST')
    })

    return {...toRefs(state), newRoom, joinRoom}
  }
})
</script>
