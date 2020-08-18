<template>
  <v-row justify="center" dense>
    <v-col cols="auto">
      <icon-btn icon="mdi-sync" color="warning" @click="reloadDatabase()">Reload Database</icon-btn>
    </v-col>
    <dialog-text
      label="Message"
      v-model.trim="message"
    ></dialog-text>
    <dialog-select
      label="Message Colour"
      v-model="messageColor"
      :items="messageColors"
    >
    </dialog-select>
    <v-col cols="auto">
      <icon-btn icon="mdi-send" color="success" @click="systemMessage()">Send Message</icon-btn>
    </v-col>
    <v-col cols="12">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>Anime</v-list-item-title>
          <v-list-item-subtitle>{{ $store.state.amq.gameState.currentSong.anime[0] }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>Title</v-list-item-title>
          <v-list-item-subtitle>{{ $store.state.amq.gameState.currentSong.title }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>Type</v-list-item-title>
          <v-list-item-subtitle>{{ $store.state.amq.gameState.currentSong.type }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import DialogText from '@/components/dialog/DialogText.vue'
import IconBtn from '@/components/buttons/IconBtn.vue'
import DialogSelect from '@/components/dialog/DialogSelect.vue'
import {socket} from '@/assets/socket'

export default defineComponent({
  components: {
    DialogText, IconBtn, DialogSelect
  },
  setup(_props, _context) {
    const state = reactive({
      message: '',
      messageColor: 'success',
      messageColors: ['success', 'error', 'warning']
    })


    function reloadDatabase(): void {
      socket.emit('ADMIN_RELOAD_DATABASE')
    }

    function systemMessage(): void {
      if (state.message) {
        socket.emit('ADMIN_SYSTEM_MESSAGE', state.message, state.messageColor)
      }
      state.message = ''
    }

    return {...toRefs(state), systemMessage, reloadDatabase}
  }
})
</script>
