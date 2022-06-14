<template>
  <v-card-text>
    <v-form v-model="valid" @submit.prevent="submitEdit()">
      <v-container fluid>
        <dialog-text-field
          label="Emoji ID"
          :value="$store.state.admin.emojiInEdit.emoji_id"
          disabled
        ></dialog-text-field>
        <dialog-text-field
          label="Command"
          :value="$store.state.admin.emojiInEdit.command"
          @input="updateCommand($event)"
          :rules="commandRules"
          :disabled="editActionDisabled"
        ></dialog-text-field>
        <dialog-text-field
          label="Source"
          :value="$store.state.admin.emojiInEdit.src"
          @input="updateSource($event)"
          :rules="sourceRules"
          :disabled="editActionDisabled"
        ></dialog-text-field>
        <dialog-select
          label="Type"
          :items="emojiTypes"
          :value="$store.state.admin.emojiInEdit.type"
          @input="updateType($event)"
          :rules="typeRules"
          :disabled="editActionDisabled"
        ></dialog-select>
        <dialog-actions
          :disabled="editActionDisabled"
          @dialog:close="$emit('dialog:close')"
        ></dialog-actions>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import DialogActions from '../shared/dialog/DialogActions.vue'
import DialogTextField from '../shared/dialog/DialogTextField.vue'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import DialogSelect from '../shared/dialog/DialogSelect.vue'
import { EMOJI_TYPES } from '../../assets/constants'
import { DIALOG_ROUTES } from '../../plugins/routing/routes'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { socket } from '../../plugins/socket'
import { VALID_EMOJI_TYPES } from '../../assets/shared/constants'
import { newTableHelpers } from '../../assets/table-helper'

export default defineComponent({
  components: { DialogSelect, DialogTextField, DialogActions },
  setup(_props, context) {
    const state = reactive({
      valid: false,
      emojiTypes: EMOJI_TYPES,
      commandRules: [
        (v: string) => !!v || 'Command required',
        (v: string) => validateDupeCommand(v) || 'Command already exists'
      ],
      sourceRules: [(v: string) => !!v || 'Source required'],
      typeRules: [
        (v: string) => !!v || 'Type required',
        (v: string) => validType(v) || 'Invalid type'
      ]
    })

    function validateDupeCommand(command: string): boolean {
      for (const emoji of store.getters.emojiList) {
        if (!command || command.toLowerCase().trim() === emoji.command.toLowerCase()) {
          return false
        }
      }
      return true
    }

    function validType(type: string): boolean {
      return VALID_EMOJI_TYPES.includes(type)
    }

    function updateCommand(command: string): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_EMOJI_COMMAND, command)
    }

    function updateSource(source: string): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_EMOJI_SRC, source)
    }

    function updateType(type: string): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_EMOJI_TYPE, type)
    }

    const { editActionComplete, editActionDisabled } = newTableHelpers(context)

    function submitEdit(): void {
      if (state.valid) {
        editActionDisabled.value = true
        if (store.state.client.dialogView === DIALOG_ROUTES.NEW_EMOJI_DIALOG) {
          socket.emit(
            SHARED_EVENTS.ADMIN_NEW_EMOJI,
            store.state.admin.emojiInEdit,
            (proceed: boolean) => {
              editActionComplete(proceed)
            }
          )
        } else if (store.state.client.dialogView === DIALOG_ROUTES.EDIT_EMOJI_DIALOG) {
          socket.emit(
            SHARED_EVENTS.ADMIN_EDIT_EMOJI,
            store.state.admin.emojiInEdit,
            (proceed: boolean) => {
              editActionComplete(proceed)
            }
          )
        }
      }
    }

    return {
      ...toRefs(state),
      submitEdit,
      updateCommand,
      updateSource,
      updateType,
      editActionDisabled
    }
  }
})
</script>
