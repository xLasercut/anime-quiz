<template>
  <v-card-actions>
    <v-menu top offset-y :transition="false" v-model="show" max-height="304px">
      <template #activator="{ on }">
        <v-textarea
          no-resize
          filled
          clearable
          hide-details
          v-model="message"
          label="Message"
          append-icon="mdi-send"
          class="dialog-item"
          rows="3"
          @click:append="sendMsg()"
          @keydown.enter.exact.prevent="sendMsg()"
          ref="chatInput"
        ></v-textarea>
      </template>
      <v-list>
        <v-list-item v-for="item in choices" :key="item.command" @click="addEmoji(item.command)">
          <v-list-item-avatar tile>
            <v-img :src="item.src" v-if="item.type === 'img'"></v-img>
            <span v-else>{{ item.src }}</span>
          </v-list-item-avatar>
          <v-list-item-content>
            {{ `:${item.command}:` }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card-actions>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, watch } from '@vue/composition-api'
import { socket } from '../../../plugins/socket'
import { SHARED_EVENTS } from '../../../assets/shared/events'
import { store } from '../../../plugins/store'
import { AqEmoji } from '../../../assets/shared/interfaces'

const EMOJI_CHAT_FORMAT = new RegExp('(:)(?:[^:]+)$', 'ig')

interface State {
  message: string
  show: boolean
  choices: AqEmoji[]
  choicesOldLength: number
}

export default defineComponent({
  setup() {
    const state = reactive<State>({
      message: '',
      show: false,
      choices: [],
      choicesOldLength: 0
    })

    const chatInput: any = ref(null)

    function sendMsg(): void {
      if (state.message) {
        socket.emit(SHARED_EVENTS.GAME_CHAT, state.message)
        state.message = ''
      }
    }

    watch(
      () => state.message,
      (val: string) => {
        if (val) {
          const match = val.match(EMOJI_CHAT_FORMAT)
          if (match) {
            const command = match[0]
            state.choices = store.getters.emojiList.filter((emoji: AqEmoji) => {
              return `:${emoji.command.toLowerCase()}:`.includes(command.toLowerCase())
            })
            const currentLength = state.choices.length
            if (currentLength > 0) {
              if (currentLength !== state.choicesOldLength) {
                state.choicesOldLength = currentLength
                state.show = false
              }
              setTimeout(() => {
                state.show = true
              }, 1)
            } else {
              state.show = false
            }
          }
        }
      }
    )

    function addEmoji(command: string): void {
      state.message = state.message.replace(EMOJI_CHAT_FORMAT, `:${command}:`)
      chatInput.value.focus()
    }

    return {
      ...toRefs(state),
      sendMsg,
      addEmoji,
      chatInput
    }
  }
})
</script>
