<template>
  <v-main>
    <v-row justify="center">
      <v-col cols="auto">
        <icon-btn icon="mdi-plus" color="success" @click="show = true">New Room</icon-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto" v-for="room in $store.state.client.roomList" :key="room.roomId">
        <room-card :room="room" @room:join="joinRoom($event)"></room-card>
      </v-col>
    </v-row>
    <game-dialog v-model="show" label="New Room">
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
import {defineComponent, onMounted, onUnmounted, reactive, toRefs} from '@vue/composition-api'
import IconBtn from '@/components/buttons/IconBtn.vue'
import GameDialog from '@/components/GameDialog.vue'
import DialogText from '@/components/dialog/DialogText.vue'
import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'
import {NAME_FORMAT} from '@/assets/config/formats'
import {leaveAllRooms, socket} from '@/assets/socket'
import RoomCard from '@/components/game/RoomCard.vue'
import {IRoomSerial} from '../../../../shared/interfaces/game'

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
          context.root.$store.getters.viewCommand('join-new'),
          state.roomName,
          context.root.$store.state.client.username,
          context.root.$store.state.client.avatar
        )
        context.root.$store.commit('UPDATE_VIEW', context.root.$store.getters.viewCommand('command'))
      }

    }

    function joinRoom(roomId: string): void {
      socket.emit(
        context.root.$store.getters.viewCommand('join-exist'),
        roomId,
        context.root.$store.state.client.username,
        context.root.$store.state.client.avatar
      )
      context.root.$store.commit('UPDATE_VIEW', context.root.$store.getters.viewCommand('command'))
    }

    const UPDATE_ROOM_LIST_EVENT = context.root.$store.getters.viewCommand('update-room-list')

    socket.on(UPDATE_ROOM_LIST_EVENT, (roomList: Array<IRoomSerial>): void => {
      context.root.$store.commit('UPDATE_ROOM_LIST', roomList)
    })

    onMounted(() => {
      leaveAllRooms()
      context.root.$store.commit('UPDATE_ROOM_LIST', [])
      socket.emit(context.root.$store.getters.viewCommand('get-room-list'))
    })

    onUnmounted(() => {
      socket.off(UPDATE_ROOM_LIST_EVENT)
    })

    return {...toRefs(state), newRoom, joinRoom}
  }
})
</script>
