<template>
  <v-row justify="center">
    <v-col cols="auto" v-for="room in roomList" :key="room">
      <v-card width="200" variant="flat">
        <v-card-title>
          {{ room.split('|')[1] }}
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
</template>

<script setup lang="ts">
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { socket } from '@/plugins/socket';
import { GameRoomId, SOCKET_EVENTS, TGameRoomId } from 'anime-quiz-shared-resources';
import { useGameStore } from '@/plugins/store/game';
import { useRouter } from 'vue-router';
import { ROUTES } from '@/plugins/router/constants';

const gameStore = useGameStore();
const router = useRouter();

const roomList = ref<TGameRoomId[]>([]);

socket.on(SOCKET_EVENTS.UPDATE_ROOM_LIST, (_roomList: TGameRoomId[]) => {
  roomList.value = _roomList.map((item) => GameRoomId.parse(item));
});

onMounted(() => {
  socket.emit(SOCKET_EVENTS.GET_ROOM_LIST);
  gameStore.$reset();
});

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.UPDATE_ROOM_LIST);
});

function joinRoom(roomId: TGameRoomId) {
  router.push(ROUTES.MAIN_GAME(roomId));
}
</script>
