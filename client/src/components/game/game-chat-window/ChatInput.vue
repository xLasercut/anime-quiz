<template>
  <v-row justify="center">
    <v-col>
      <v-menu top offset-y :transition="false" v-model="show" max-height="304px">
        <template #activator="{on}">
          <v-textarea
            solo no-resize flat clearable hide-details
            v-model.trim="message"
            label="Message" append-icon="mdi-send"
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
              <span v-else>{{item.src}}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              {{`:${item.command}:`}}
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs, watch} from '@vue/composition-api'
import {EMOJI_CHAT_FORMAT} from '@/assets/config/formats'
import {IEmoji} from '../../../../../shared/interfaces/database'

export default defineComponent({
  setup(_props, context) {
    const state = reactive({
      message: '',
      show: false,
      choices: [],
      choicesOldLength: 0
    })

    const chatInput: any = ref(null)

    function sendMsg(): void {
      if (state.message) {
        context.emit('chat', state.message)
        state.message = ''
      }
    }

    watch(() =>  state.message, (val) => {
      if (val) {
        let match = val.match(EMOJI_CHAT_FORMAT)
        if (match) {
          let command = match[0]
          state.choices = context.root.$store.state.emoji.emojiList.filter((emoji: IEmoji) => {
            if (`:${emoji.command.toLowerCase()}:`.includes(command.toLowerCase())) {
              return emoji
            }
          })
          let currentLength = state.choices.length
          if (currentLength > 0) {
            if (currentLength != state.choicesOldLength) {
              state.choicesOldLength = currentLength
              state.show = false
            }
            setTimeout(() => {
              state.show = true
            }, 1)
          }
          else {
            state.show = false
          }
        }
      }
    })

    function addEmoji(command: string): void {
      state.message = state.message.replace(EMOJI_CHAT_FORMAT, `:${command}:`)
      chatInput.value.focus()
    }

    return {...toRefs(state), sendMsg, addEmoji, chatInput}
  }
})
</script>
