<template>
  <v-main>
    <v-card flat>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { socket } from '../plugins/socket'
import { SHARED_EVENTS } from '../assets/shared/events'

export default defineComponent({
  setup() {
    socket.emit(SHARED_EVENTS.JOIN_SONG_EDIT)
  }
})
</script>
