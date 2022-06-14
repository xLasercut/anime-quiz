<template>
  <v-card-text>
    <v-form v-model="valid" @submit.prevent="submitEdit()">
      <v-container fluid>
        <dialog-text-field
          label="Anime ID"
          :value="$store.state.admin.animeInEdit.anime_id"
          disabled
        ></dialog-text-field>
        <dialog-multi-combobox
          label="Anime Names"
          :rules="rules"
          @input="updateAnimeNames($event)"
          :value="$store.state.admin.animeInEdit.anime_name"
          :disabled="editActionDisabled"
        ></dialog-multi-combobox>
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
import DialogMultiCombobox from '../shared/dialog/DialogMultiCombobox.vue'
import DialogTextField from '../shared/dialog/DialogTextField.vue'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { DIALOG_ROUTES } from '../../plugins/routing/routes'
import { socket } from '../../plugins/socket'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { newTableHelpers } from '../../assets/table-helper'

export default defineComponent({
  components: { DialogMultiCombobox, DialogTextField, DialogActions },
  setup(_props, context) {
    const state = reactive({
      valid: false,
      rules: [
        (v: string[]) => v.length > 0 || "Name can't be blank",
        (v: string[]) => validAnimeName(v) || 'Invalid anime name'
      ]
    })

    function validAnimeName(animeNames: string[]): boolean {
      for (const animeName of animeNames) {
        if (!animeName || typeof animeName !== 'string') {
          return false
        }
      }
      return true
    }

    function updateAnimeNames(names: string[]) {
      store.commit(MUTATIONS.ADMIN_UPDATE_ANIME_NAME, names)
    }

    const { editActionComplete, editActionDisabled } = newTableHelpers(context)

    function submitEdit(): void {
      if (state.valid) {
        editActionDisabled.value = true
        if (store.state.client.dialogView === DIALOG_ROUTES.EDIT_ANIME_DIALOG) {
          socket.emit(
            SHARED_EVENTS.ADMIN_EDIT_ANIME,
            store.state.admin.animeInEdit,
            (proceed: boolean) => {
              editActionComplete(proceed)
            }
          )
        } else if (store.state.client.dialogView === DIALOG_ROUTES.NEW_ANIME_DIALOG) {
          socket.emit(
            SHARED_EVENTS.ADMIN_NEW_ANIME,
            store.state.admin.animeInEdit,
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
      updateAnimeNames,
      editActionDisabled
    }
  }
})
</script>
