<template>
  <v-row justify="center">
    <v-col>
      <v-menu top offset-y :transition="false">
        <template #activator="{on}">
          <v-textarea
            solo no-resize flat clearable hide-details
            v-model.trim="message"
            label="Message" append-icon="mdi-send"
            class="dialog-item"
            rows="3"
            @click:append="sendMsg()"
            @keydown.enter.exact.prevent="sendMsg()"
          ></v-textarea>
        </template>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {defineComponent, reactive, toRefs} from '@vue/composition-api'
  import {socket} from '@/assets/socket'

  export default defineComponent({
    setup(_props, context) {
      const state = reactive({
        message: '',
        show: false
      })

      function sendMsg(): void {
        if (state.message) {
          socket.emit('PLAYER_CHAT', state.message)
          state.message = ''
        }
      }

      return {...toRefs(state), sendMsg}
    }
  })
</script>
