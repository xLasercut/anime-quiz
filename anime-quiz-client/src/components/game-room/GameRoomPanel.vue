<template>
  <v-toolbar-items>
    <nav-btn color="info" icon="mdi-cog">Settings</nav-btn>
    <nav-btn color="warning" icon="mdi-backspace-reverse-outline" @click="back()">Back</nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import NavBtn from '../shared/buttons/NavBtn.vue'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { ROUTES } from '../../plugins/routing/routes'
import { socket } from '../../plugins/socket'
import { SHARED_EVENTS } from '../../assets/shared/events'

export default defineComponent({
  components: { NavBtn },
  setup() {
    function back(): void {
      socket.emit(SHARED_EVENTS.LEAVE_ALL_ROOMS)
      store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.ROOM_LIST)
    }

    return {
      back
    }
  }
})
</script>
