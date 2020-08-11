<template>
  <v-toolbar-items>
    <nav-btn color="warning" icon="mdi-sync" @click="reloadChatBotList()"></nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import NavBtn from '../components/buttons/NavBtn.vue'
import {socket} from '@/assets/socket'

export default defineComponent({
  components: {
    NavBtn
  },
  setup(_props, context) {
    function reloadChatBotList(): void {
      context.root.$store.commit('SOCKET_UPDATE_CHAT_BOT_LIST', [])
      socket.emit('GET_CHAT_BOT_LIST')
    }

    return {reloadChatBotList}
  }
})
</script>
