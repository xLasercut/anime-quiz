<template>
  <v-card flat width="200px">
    <v-card-title>
      <span>{{room.name}}</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-actions>
      <icon-btn
        icon="mdi-login"
        color="success"
        @click="$emit('room:join', room.roomId)"
      >Join</icon-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import IconBtn from '@/components/buttons/IconBtn.vue'

export default defineComponent({
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
