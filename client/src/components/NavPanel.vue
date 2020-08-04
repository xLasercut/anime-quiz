<template>
  <div>
    <v-app-bar app flat height="60px" min-height="60px">
      <v-toolbar-items>
        <nav-btn icon="mdi-theme-light-dark" @click="toggleTheme()"></nav-btn>
        <nav-btn icon="mdi-home" color="primary" @click="$router.push('/login')" v-if="showHome"></nav-btn>
        <nav-btn icon="mdi-arrow-left-bold" color="info" @click="$emit('screen:back')" v-if="showBack"></nav-btn>
        <nav-btn icon="mdi-shield-account" color="warning" @click="show = true" v-if="$store.state.client.admin"></nav-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <slot></slot>
    </v-app-bar>
    <game-dialog
      label="Admin"
      v-model="show"
    >
      <v-row justify="center">
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
      </v-row>
    </game-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import NavBtn from '@/components/buttons/NavBtn.vue'
import GameDialog from '@/components/GameDialog.vue'
import IconBtn from '@/components/buttons/IconBtn.vue'
import {socket} from '@/assets/socket'
import DialogText from '@/components/dialog/DialogText.vue'
import DialogSelect from '@/components/dialog/DialogSelect.vue'

export default defineComponent({
  props: {
    showHome: {
      type: Boolean,
      default: false
    },
    showBack: {
      type: Boolean,
      default: false
    }
  },
  components: {
    NavBtn, GameDialog, IconBtn, DialogText, DialogSelect
  },
  setup(_props, context) {
    const state = reactive({
      show: false,
      message: '',
      messageColor: 'success',
      messageColors: ['success', 'error', 'warning']
    })

    function toggleTheme(): void {
      context.root.$vuetify.theme.dark = !context.root.$vuetify.theme.dark
      localStorage.dark = context.root.$vuetify.theme.dark
    }

    function reloadDatabase(): void {
      socket.emit('ADMIN_RELOAD_DATABASE')
    }

    function systemMessage(): void {
      if (state.message) {
        socket.emit('ADMIN_SYSTEM_MESSAGE', state.message, state.messageColor)
      }
      state.message = ''
    }

    return {toggleTheme, ...toRefs(state), reloadDatabase, systemMessage}
  }
})
</script>
