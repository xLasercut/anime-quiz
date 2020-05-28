<template>
  <v-card flat>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="auto">
          <icon-btn color="success" icon="mdi-plus" @click="openDialog(null)">New Bot Command</icon-btn>
        </v-col>
        <v-col cols="auto">
          <icon-btn color="warning" icon="mdi-sync" @click="reload()">Reload</icon-btn>
        </v-col>
      </v-row>
      <chat-bot-list-table
        @chat:edit="openDialog($event)"
      ></chat-bot-list-table>
      <game-dialog v-model="show" label="Chat Bot Editor">
        <v-form v-model="valid" @submit.prevent="confirmEmojiEdit()">
          <v-row justify="center">
            <dialog-text
              label="Regex"
              v-model="form.regex"
            ></dialog-text>
            <dialog-text
              label="Flag"
              v-model.trim="form.flag"
            ></dialog-text>
            <dialog-select
              label="Avatar"
              :items="$store.getters.avatarList"
              item-value="avatar"
              v-model="form.response.avatar"
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
              v-model.trim="form.response.user"
            ></dialog-text>
            <dialog-textarea
              label="Text"
              v-model.trim="form.response.text"
            ></dialog-textarea>
            <dialog-text
              label="ID"
              v-model.trim="form.response.id"
            ></dialog-text>
            <dialog-confirm-btn :disabled="!valid"></dialog-confirm-btn>
          </v-row>
        </v-form>
      </game-dialog>
    </v-container>
  </v-card>
</template>

<script lang="ts">
  import {defineComponent, reactive, toRefs} from '@vue/composition-api'
  import ChatBotListTable from '@/misc/chat-bot/ChatBotListTable.vue'
  import IconBtn from '@/components/buttons/IconBtn.vue'
  import {socket} from '@/assets/socket'
  import GameDialog from '@/components/GameDialog.vue'
  import DialogText from '@/components/dialog/DialogText.vue'
  import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'
  import DialogSelect from '@/components/dialog/DialogSelect.vue'
  import {IChatBot} from '../../../shared/interfaces/database'
  import DialogTextarea from '@/components/dialog/DialogTextarea.vue'

  export default defineComponent({
    components: {
      ChatBotListTable, IconBtn, GameDialog, DialogText, DialogConfirmBtn,
      DialogSelect, DialogTextarea
    },
    setup(_props, context) {
      const state = reactive({
        form: Object.assign({}, getDefaultForm()),
        show: false,
        valid: false,
        isEdit: false
      })

      function getDefaultForm(): IChatBot {
        return {
          regex: '',
          flag: '',
          response: {
            user: '',
            text: '',
            avatar: '',
            id: ''
          }
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

      function reload(): void {
        context.root.$store.commit('SOCKET_UPDATE_CHAT_BOT_LIST', [])
        socket.emit('GET_CHAT_BOT_LIST')
      }

      return {...toRefs(state), reload, openDialog}
    }
  })
</script>
