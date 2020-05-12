<template>
  <v-row justify="center">
    <new-room-dialog></new-room-dialog>
    <v-col cols="auto" v-for="room in roomList" :key="room.roomId">
      <room-card :room="room"></room-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
  import {socket} from '@/assets/socket'
  import NewRoomDialog from '@/game/room-list/NewRoomDialog.vue'
  import RoomCard from '@/game/room-list/RoomCard.vue'

  export default defineComponent({
    components: {
      NewRoomDialog, RoomCard
    },
    setup(_props, context) {
      const state = reactive({
        roomList: []
      })

      onMounted(() => {
        socket.on('UPDATE_ROOM_LIST', (roomList: any) => {
          state.roomList = roomList
        })

        socket.on('disconnect', (): void => {
          context.root.$router.push('/login')
        })

        socket.emit('GET_ROOM_LIST')
      })

      return {...toRefs(state)}
    }
  })
</script>
