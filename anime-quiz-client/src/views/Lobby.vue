<template>
  <v-main>
    <v-row>
      <v-col>
        GAME
      </v-col>
      <v-col>
        <v-btn @click="test()">SONG LIST</v-btn>
      </v-col>
    </v-row>
  </v-main>
</template>

<script setup lang="ts">
import {socket} from '../plugins/socket'

function test() {
  socket.emit('TEST')
}
</script>
