<template>
  <v-main>
    <v-card flat>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="auto">
            <icon-btn color="success" icon="mdi-plus" @click="openDialog(null)">New Bot Command</icon-btn>
          </v-col>
        </v-row>
        <chat-bot-list-table
          @chat:edit="openDialog($event)"
          @chat:delete="deleteChatBot($event)"
        ></chat-bot-list-table>
        <game-dialog v-model="show" label="Chat Bot Editor">
          <v-form v-model="valid" @submit.prevent="confirmEdit()">
            <v-row justify="center" dense>
              <dialog-text
                label="Regex"
                v-model="form.regex"
                :rules="rules('Regex')"
              ></dialog-text>
              <dialog-text
                label="Flag"
                v-model.trim="form.flag"
              ></dialog-text>
              <dialog-select
                label="Avatar"
                :items="$store.getters.avatarList"
                item-value="avatar"
                v-model="form.avatar"
                :rules="rules('Avatar')"
              >
                <template #item="{item}">
                  <v-list-item-avatar>
                    <v-img :src="item.src"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.avatar"></v-list-item-title>
                  </v-list-item-content>
                </template>

                <template #selection="{item}">
                  <v-list-item-avatar>
                    <v-img :src="item.src"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.avatar"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </dialog-select>
              <dialog-text
                label="User"
                v-model.trim="form.user"
                :rules="rules('User')"
              ></dialog-text>
              <dialog-textarea
                label="Text"
                v-model.trim="form.text"
                :rules="rules('Text')"
              ></dialog-textarea>
              <dialog-text
                label="ID"
                v-model.trim="form.userId"
                :rules="rules('ID')"
              ></dialog-text>
              <dialog-confirm-btn :disabled="!valid"></dialog-confirm-btn>
            </v-row>
          </v-form>
        </game-dialog>
      </v-container>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import ChatBotListTable from '@/chat-bot/ChatBotListTable.vue'
import GameDialog from '@/components/GameDialog.vue'
import DialogText from '@/components/dialog/DialogText.vue'
import DialogTextarea from '@/components/dialog/DialogTextarea.vue'
import DialogSelect from '@/components/dialog/DialogSelect.vue'
import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'
import {IChatBot} from '../../../shared/interfaces/database'
import IconBtn from '@/components/buttons/IconBtn.vue'
import {socket} from '@/assets/socket'

export default defineComponent({
  components: {
    ChatBotListTable, GameDialog, DialogText, DialogSelect, DialogTextarea, DialogConfirmBtn, IconBtn
  },
  setup(_props, context) {
    const state = reactive({
      show: false,
      valid: false,
      isEdit: false,
      form: Object.assign({}, getDefaultForm())
    })

    function getDefaultForm(): IChatBot {
      return {
        regex: '',
        flag: '',
        user: '',
        text: '',
        avatar: '',
        userId: ''
      }
    }

    function openDialog(chatBot: IChatBot | null): void {
      if (chatBot) {
        state.form = Object.assign({}, chatBot)
        state.isEdit = true
      }
      else {
        state.form = Object.assign({}, getDefaultForm())
        state.isEdit = false
      }
      state.show = true
    }

    function confirmEdit(): void {
      if (state.valid && state.show) {
        if (state.isEdit) {
          socket.emit('EDIT_GAME_CHAT_BOT', state.form)
        }
        else {
          socket.emit('ADD_GAME_CHAT_BOT', state.form)
        }
        state.show = false
      }
    }

    function deleteChatBot(chatBot: IChatBot): void {
      socket.emit('DELETE_GAME_CHAT_BOT', chatBot)
    }

    function rules(label: string): Array<any> {
      return [
        (v: string): boolean | string => !!v || `${label} cannot be empty`
      ]
    }

    return {...toRefs(state), openDialog, confirmEdit, rules, deleteChatBot}
  }
})
</script>
