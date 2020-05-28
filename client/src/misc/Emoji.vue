<template>
  <v-card flat>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="auto">
          <icon-btn icon="mdi-plus" color="success" @click="openDialog(null)">New Emoji</icon-btn>
        </v-col>
        <v-col cols="auto">
          <icon-btn icon="mdi-sync" color="warning" @click="reloadEmojiList()">Reload</icon-btn>
        </v-col>
      </v-row>
      <emoji-list-table
        @emoji:edit="openDialog($event)"
        @emoji:delete="deleteEmoji($event)"
      ></emoji-list-table>
      <game-dialog v-model="show" label="Emoji Editor">
        <v-form v-model="valid" @submit.prevent="confirmEmojiEdit()">
          <v-row justify="center">
            <v-col cols="12">
              <v-row justify="center" no-gutters>
                <v-col cols="auto">
                  <emoji-preview :emoji="emoji()"></emoji-preview>
                </v-col>
              </v-row>
            </v-col>
            <dialog-text
              label="Command"
              v-model.trim="form.command"
              :rules="commandRules"
            ></dialog-text>
            <dialog-text
              label="Source"
              v-model.trim="form.src"
              :rules="sourceRules"
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
  import EmojiListTable from '@/misc/emoji/EmojiListTable.vue'
  import GameDialog from '@/components/GameDialog.vue'
  import IconBtn from '@/components/buttons/IconBtn.vue'
  import DialogText from '@/components/dialog/DialogText.vue'
  import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'
  import EmojiPreview from '@/misc/emoji/EmojiPreview.vue'
  import {IEmoji} from '../../../shared/interfaces/database'
  import {EMOJI_COMMAND_FORMAT, IMAGE_FORMAT} from '@/assets/config/formats'
  import {IEmojiType} from '../../../shared/types/game'
  import {socket} from '@/assets/socket'

  export default defineComponent({
    components: {
      EmojiListTable, GameDialog, IconBtn, DialogText, DialogConfirmBtn,
      EmojiPreview
    },
    setup(_props, context) {
      const state = reactive({
        show: false,
        valid: false,
        form: Object.assign({}, getDefaultForm()),
        commandRules: [
          (v: string): boolean | string => (!!v) || 'Command cannot be empty',
          (v: string): boolean | string => EMOJI_COMMAND_FORMAT.test(v) || 'Command only accepts: a-z, A-Z, 0-9',
          (v: string): boolean | string => v && v.length <= 20 || 'Command must be between 1-20 characters',
        ],
        sourceRules: [
          (v: string): boolean | string => !!v || 'Source cannot be empty'
        ],
        isEdit: false
      })

      function getDefaultForm(): IEmoji {
        return {
          command: '',
          src: '',
          type: 'dec'
        }
      }

      function openDialog(emoji: IEmoji | null): void {
        if (emoji) {
          state.form = Object.assign({}, emoji)
          state.isEdit = true
        }
        else {
          state.form = Object.assign({}, getDefaultForm())
          state.isEdit = false
        }
        state.show = true
      }

      function confirmEmojiEdit(): void {
        if (state.valid && state.show) {
          if (state.isEdit) {
            socket.emit('EDIT_GAME_EMOJI', emoji())
          }
          else {
            socket.emit('ADD_GAME_EMOJI', emoji())
          }
          state.show = false
        }
      }

      function deleteEmoji(emoji: IEmoji): void {
        socket.emit('DELETE_GAME_EMOJI', emoji)
      }

      function emoji(): IEmoji {
        let type: IEmojiType = 'dec'
        if (state.form.src && IMAGE_FORMAT.test(state.form.src)) {
          type = 'img'
        }
        return {
          command: state.form.command,
          src: state.form.src,
          type: type
        }
      }

      function reloadEmojiList(): void {
        context.root.$store.commit('SOCKET_UPDATE_EMOJI_LIST', [])
        socket.emit('GET_EMOJI_LIST')
      }

      return {...toRefs(state), confirmEmojiEdit, emoji, openDialog, deleteEmoji, reloadEmojiList}
    }
  })
</script>
