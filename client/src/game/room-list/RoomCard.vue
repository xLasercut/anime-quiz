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
        <icon-btn color="success" icon="mdi-login">Join</icon-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import {IRoom} from '../../../../shared/interfaces/game'
  import IconBtn from '@/components/buttons/IconBtn.vue'

  interface IProp {
    room: IRoom
  }

  export default defineComponent<IProp>({
    components: {
      IconBtn
    },
    props: {
      room: {
        required: true
      }
    }
  })
</script>

<style scoped>
  .room-card-container {
    width: 200px;
  }
</style>
