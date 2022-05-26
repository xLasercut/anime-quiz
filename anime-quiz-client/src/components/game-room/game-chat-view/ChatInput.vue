<template>
  <v-card-actions>
    <v-textarea
      no-resize filled clearable hide-details
      v-model="message"
      label="Message" append-icon="mdi-send"
      class="dialog-item"
      rows="3"
      @click:append="sendMsg()"
      @keydown.enter.exact.prevent="sendMsg()"
    ></v-textarea>
  </v-card-actions>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { socket } from '../../../plugins/socket'
import { SHARED_EVENTS } from '../../../assets/shared/events'

export default defineComponent({
  setup() {
    const state = reactive({
      message: ''
    })

    function sendMsg(): void {
      if (state.message) {
        socket.emit(SHARED_EVENTS.GAME_CHAT, state.message)
        state.message = ''
      }
    }

    return {
      ...toRefs(state),
      sendMsg
    }
  }
})
</script>
