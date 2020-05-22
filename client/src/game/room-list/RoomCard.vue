<template>
  <div class="room-card-container">
    <v-card>
      <v-card-title>
        <span>{{room.name}}</span>
      </v-card-title>
      <v-card-subtitle>
        {{room.type.toUpperCase()}}
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-card-actions>
        <icon-btn color="success" icon="mdi-login" @click="joinRoom()">Join</icon-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import {IRoomSerial} from '../../../../shared/interfaces/game'
  import IconBtn from '@/components/buttons/IconBtn.vue'
  import {socket} from '@/assets/socket'

  interface IProp {
    room: IRoomSerial
  }

  export default defineComponent<IProp>({
    components: {
      IconBtn
    },
    props: {
      room: {
        required: true
      }
    },
    setup(props, context) {
      function joinRoom(): void {
        let event = `LOGIN_${props.room.type.toUpperCase()}_EXIST`
        socket.emit(
          event,
          props.room.roomId,
          context.root.$store.state.client.username,
          context.root.$store.state.client.avatar
        )
        context.root.$store.commit('UPDATE_ROOM_MODE', props.room.type)
      }

      return {joinRoom}
    }
  })
</script>

<style scoped>
  .room-card-container {
    width: 200px;
  }
</style>
