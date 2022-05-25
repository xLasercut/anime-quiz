<template>
  <v-main>
    <v-row justify="center">
      <v-col cols="auto" v-for="room in roomList">
        <v-card width="200" flat>
          <v-card-title>
            {{ room.split('|')[0] }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions>
            <v-row justify="end">
              <v-col cols="auto">
                <icon-btn color="success" icon="mdi-login" large @click="joinRoom(room)">Join</icon-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, toRefs } from '@vue/composition-api'
import { socket } from '../plugins/socket'
import { SHARED_EVENTS } from '../assets/shared/events'
import IconBtn from '../components/shared/buttons/IconBtn.vue'
import { store } from '../plugins/store'
import { MUTATIONS } from '../plugins/store/mutations'
import { ROUTES } from '../plugins/routing/routes'

interface State {
  roomList: string[]
}

export default defineComponent({
  components: { IconBtn },
  setup() {
    const state = reactive<State>({
      roomList: []
    })

    function joinRoom(roomName: string): void {
      socket.emit(SHARED_EVENTS.JOIN_GAME_ROOM, roomName, (proceed: boolean) => {
        if (proceed) {
          store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.GAME_ROOM)
        }
      })
    }

    onMounted(() => {
      socket.on(SHARED_EVENTS.UPDATE_ROOM_LIST, (roomList: string[]) => {
        state.roomList = roomList
      })

      socket.emit(SHARED_EVENTS.LEAVE_ALL_ROOMS)
      socket.emit(SHARED_EVENTS.GET_ROOM_LIST)
    })

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.UPDATE_ROOM_LIST)
    })

    return {
      ...toRefs(state),
      joinRoom
    }
  }
})
</script>
