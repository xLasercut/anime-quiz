<template>
  <v-toolbar-items>
    <nav-btn icon="mdi-sync" color="warning" @click="reloadRoomList()"></nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import NavBtn from '@/components/buttons/NavBtn.vue'
import {socket} from '@/assets/socket'

export default defineComponent({
  components: {
    NavBtn
  },
  setup(_props, context) {
    function reloadRoomList(): void {
      context.root.$store.commit('UPDATE_ROOM_LIST', [])
      socket.emit(context.root.$store.getters.viewCommand('get-room-list'))
    }

    return {reloadRoomList}
  }
})
</script>
