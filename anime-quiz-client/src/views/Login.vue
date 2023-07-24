<template>
  login
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import {useRoute} from "vue-router";
import {socket} from "@/plugins/socket";

export default defineComponent({
  setup() {
    const route = useRoute()

    onMounted(() => {
      // socket.connect()
      socket.emit("discord_code", route.query)
      console.log(route.query)
    })
  }
})
</script>
