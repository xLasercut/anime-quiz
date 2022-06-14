<template>
  <v-card-text>
    <v-form v-model="valid" @submit.prevent="submitEdit()">
      <v-container fluid>
        <dialog-text-field
          label="Song ID"
          :value="$store.state.admin.songInEdit.song_id"
          disabled
        ></dialog-text-field>
        <dialog-multi-combobox
          label="Anime Name"
          :value="$store.state.admin.songInEdit.anime_name"
          disabled
        ></dialog-multi-combobox>
        <dialog-multi-autocomplete
          label="Anime ID"
          :value="$store.state.admin.songInEdit.anime_id"
          item-value="anime_id"
          item-text="anime_name"
          disabled
        ></dialog-multi-autocomplete>
        <dialog-text-field
          label="Title"
          :value="$store.state.admin.songInEdit.song_title"
          disabled
        ></dialog-text-field>
        <dialog-text-field
          label="Artist"
          :value="$store.state.admin.songInEdit.artist"
          disabled
        ></dialog-text-field>
        <dialog-text-field
          label="Source"
          :value="$store.state.admin.songInEdit.src"
          disabled
        ></dialog-text-field>
        <dialog-select
          label="Type"
          :items="songTypes"
          :value="$store.state.admin.songInEdit.type"
          disabled
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
import DialogMultiCombobox from '../shared/dialog/DialogMultiCombobox.vue'
import DialogTextField from '../shared/dialog/DialogTextField.vue'
import { store } from '../../plugins/store'
import DialogSelect from '../shared/dialog/DialogSelect.vue'
import { SONG_TYPES } from '../../assets/constants'
import DialogMultiAutocomplete from '../shared/dialog/DialogMultiAutocomplete.vue'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { socket } from '../../plugins/socket'
import { newTableHelpers } from '../../assets/table-helper'

export default defineComponent({
  components: {
    DialogMultiAutocomplete,
    DialogSelect,
    DialogMultiCombobox,
    DialogTextField,
    DialogActions
  },
  setup(_props, context) {
    const state = reactive({
      valid: false,
      songTypes: SONG_TYPES
    })

    const { editActionComplete, editActionDisabled } = newTableHelpers(context)

    function submitEdit(): void {
      if (state.valid) {
        editActionDisabled.value = true
        socket.emit(
          SHARED_EVENTS.ADMIN_DELETE_SONG,
          store.state.admin.songInEdit,
          (proceed: boolean) => {
            editActionComplete(proceed)
          }
        )
      }
    }

    return {
      ...toRefs(state),
      submitEdit,
      editActionDisabled
    }
  }
})
</script>
