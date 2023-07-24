<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';
import {socket} from "@/plugins/socket";

export default defineComponent({
  components: { HelloWorld },
  setup() {
    onMounted(() => {
      socket.on("discord_redirect", (url: string) => {
        window.location.href = url
      })
    })
  }
});
</script>
