<template>
  <v-toolbar-items>
    <nav-btn color="warning" icon="mdi-sync" @click="reloadAmqRoomList()"></nav-btn>
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
  setup(_props, _context) {
    function reloadAmqRoomList(): void {
      socket.emit('GET_AMQ_ROOM_LIST')
    }

    return {reloadAmqRoomList}
  }
})
</script>
