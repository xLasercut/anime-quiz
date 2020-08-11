<template>
  <v-toolbar-items>
    <nav-btn color="warning" icon="mdi-sync" @click="reloadEmojiList()"></nav-btn>
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
    function reloadEmojiList(): void {
      context.root.$store.commit('SOCKET_UPDATE_EMOJI_LIST', [])
      socket.emit('GET_EMOJI_LIST')
    }

    return {reloadEmojiList}
  }
})
</script>
