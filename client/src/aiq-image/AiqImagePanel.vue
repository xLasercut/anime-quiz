<template>
  <v-toolbar-items>
    <nav-btn icon="mdi-sync" color="warning" @click="reload()"></nav-btn>
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
    function reload(): void {
      context.root.$store.commit('SOCKET_UPDATE_AIQ_IMAGE_LIST', [])
      socket.emit('GET_AIQ_IMAGE_LIST')
    }

    return {reload}
  }
})
</script>
