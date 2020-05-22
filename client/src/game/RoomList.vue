<template>
  <v-row justify="center">
    <new-room-dialog></new-room-dialog>
    <v-col cols="auto" v-for="room in $store.state.client.roomList" :key="room.roomId">
      <room-card :room="room"></room-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import NewRoomDialog from '@/game/room-list/NewRoomDialog.vue'
  import RoomCard from '@/game/room-list/RoomCard.vue'

  export default defineComponent({
    components: {
      NewRoomDialog, RoomCard
    },
    setup(_props, context) {
      return {}
    }
  })
</script>
