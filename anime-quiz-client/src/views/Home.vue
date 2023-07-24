<template>
  <v-btn @click="login()">Login with discord</v-btn>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {socket} from "@/plugins/socket";

export default defineComponent({
  setup() {
    function login() {
      socket.connect()
    }

    return {login}
  }
})
</script>
