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
          :rules="animeIdRules"
          @input="updateAnimeIds($event)"
          :items="$store.state.admin.animeList"
          :value="$store.state.admin.songInEdit.anime_id"
          item-value="anime_id"
          item-text="anime_name"
        ></dialog-multi-autocomplete>
        <dialog-text-field
          label="Title"
          :value="$store.state.admin.songInEdit.song_title"
          @input="updateTitle($event)"
          :rules="titleRules"
        ></dialog-text-field>
        <dialog-text-field
          label="Artist"
          :value="$store.state.admin.songInEdit.artist"
          @input="updateArtist($event)"
        ></dialog-text-field>
        <dialog-text-field
          label="Source"
          :value="$store.state.admin.songInEdit.src"
          @input="updateSource($event)"
          :rules="sourceRules"
        ></dialog-text-field>
        <dialog-select
          label="Type"
          :items="songTypes"
          :value="$store.state.admin.songInEdit.type"
          @input="updateType($event)"
          :rules="typeRules"
        ></dialog-select>
        <dialog-actions @dialog:close="$emit('dialog:close')"></dialog-actions>
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
import DialogSelect from '../shared/dialog/DialogSelect.vue'
import { SONG_TYPES } from '../../assets/constants'
import DialogMultiAutocomplete from '../shared/dialog/DialogMultiAutocomplete.vue'

export default defineComponent({
  components: { DialogMultiAutocomplete, DialogSelect, DialogMultiCombobox, DialogTextField, DialogActions },
  setup(_props, context) {
    const state = reactive({
      valid: false,
      songTypes: SONG_TYPES,
      animeIdRules: [
        (v: string[]) => v.length > 0 || 'Name can\'t be blank',
        (v: string[]) => validAnimeIds(v) || 'Invalid anime name'
      ],
      titleRules: [
        (v: string) => !!v || 'Title required'
      ],
      sourceRules: [
        (v: string) => !!v || 'Source required'
      ],
      typeRules: [
        (v: string) => !!v || 'Type required',
        (v: string) => validType(v) || 'Invalid type'
      ]
    })

    function validAnimeIds(animeIds: string[]): boolean {
      for (const animeId of animeIds) {
        if (!animeId || typeof animeId !== 'string') {
          return false
        }
      }
      return true
    }

    function validType(type: string): boolean {
      return ['OP', 'ED', 'INSERT'].includes(type)
    }

    function cleanUpVal(val: string): string {
      if (!val) {
        return ''
      }
      return val.trim()
    }

    function updateTitle(title: string): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_TITLE, cleanUpVal(title))
    }

    function updateArtist(artist: string): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_ARTIST, cleanUpVal(artist))
    }

    function updateSource(source: string): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_SRC, cleanUpVal(source))
    }

    function updateType(type: string): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_TYPE, cleanUpVal(type))
    }

    function updateAnimeIds(animeIds: string[]) {
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_ANIME_ID, animeIds)
    }

    function submitEdit(): void {
      if (state.valid) {

      }
    }

    return {
      ...toRefs(state),
      submitEdit,
      updateAnimeIds,
      updateTitle,
      updateArtist,
      updateSource,
      updateType
    }
  }
})
</script>
