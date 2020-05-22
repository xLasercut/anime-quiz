<template>
  <v-toolbar-items>
    <nav-btn color="warning" icon="mdi-sync" @click="reloadRoomList()"></nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
  import {defineComponent, onMounted} from '@vue/composition-api'
  import NavBtn from '@/components/buttons/NavBtn.vue'
  import {socket} from '@/assets/socket'

  export default defineComponent({
    components: {
      NavBtn
    },
    setup(_props, _context) {
      function reloadRoomList(): void {
        socket.emit('GET_ROOM_LIST')
      }

      onMounted((): void => {
        reloadRoomList()
      })

      return {reloadRoomList}
    }
  })
</script>
