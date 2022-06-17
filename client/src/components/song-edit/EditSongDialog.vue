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
          :items="$store.getters.adminAnimeList"
          :value="$store.state.admin.songInEdit.anime_id"
          item-value="anime_id"
          item-text="anime_name"
          :disabled="editActionDisabled"
        ></dialog-multi-autocomplete>
        <dialog-text-field
          label="Title"
          :value="$store.state.admin.songInEdit.song_title"
          @input="updateTitle($event)"
          :rules="titleRules"
          :disabled="editActionDisabled"
        ></dialog-text-field>
        <dialog-text-field
          label="Artist"
          :value="$store.state.admin.songInEdit.artist"
          @input="updateArtist($event)"
          :disabled="editActionDisabled"
        ></dialog-text-field>
        <dialog-text-field
          label="Source"
          :value="$store.state.admin.songInEdit.src"
          @input="updateSource($event)"
          :rules="sourceRules"
          :disabled="editActionDisabled"
        ></dialog-text-field>
        <dialog-select
          label="Type"
          :items="songTypes"
          :value="$store.state.admin.songInEdit.type"
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
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import DialogActions from '../shared/dialog/DialogActions.vue';
import DialogTextField from '../shared/dialog/DialogTextField.vue';
import { store } from '../../plugins/store';
import { MUTATIONS } from '../../plugins/store/mutations';
import DialogSelect from '../shared/dialog/DialogSelect.vue';
import { SONG_TYPES } from '../../assets/constants';
import DialogMultiAutocomplete from '../shared/dialog/DialogMultiAutocomplete.vue';
import { DIALOG_ROUTES } from '../../plugins/routing/routes';
import { SHARED_EVENTS } from '../../assets/shared/events';
import { socket } from '../../plugins/socket';
import { VALID_SONG_TYPES } from '../../assets/shared/constants';
import { newTableHelpers } from '../../assets/table-helper';
import DialogMultiCombobox from '../shared/dialog/DialogMultiCombobox.vue';

export default defineComponent({
  components: {
    DialogMultiAutocomplete,
    DialogSelect,
    DialogTextField,
    DialogActions,
    DialogMultiCombobox
  },
  setup(_props, context) {
    const state = reactive({
      valid: false,
      songTypes: SONG_TYPES,
      animeIdRules: [
        (v: string[]) => v.length > 0 || "Name can't be blank",
        (v: string[]) => validAnimeIds(v) || 'Invalid anime name'
      ],
      titleRules: [(v: string) => !!v || 'Title required'],
      sourceRules: [(v: string) => !!v || 'Source required'],
      typeRules: [
        (v: string) => !!v || 'Type required',
        (v: string) => validType(v) || 'Invalid type'
      ]
    });

    function validAnimeIds(animeIds: string[]): boolean {
      for (const animeId of animeIds) {
        if (!animeId || typeof animeId !== 'string') {
          return false;
        }
      }
      return true;
    }

    function validType(type: string): boolean {
      return VALID_SONG_TYPES.includes(type);
    }

    function updateTitle(title: string): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_TITLE, title);
    }

    function updateArtist(artist: string): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_ARTIST, artist);
    }

    function updateSource(source: string): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_SRC, source);
    }

    function updateType(type: string): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_TYPE, type);
    }

    function updateAnimeIds(animeIds: string[]) {
      store.commit(MUTATIONS.ADMIN_UPDATE_SONG_ANIME_ID, animeIds);
    }

    const { editActionComplete, editActionDisabled } = newTableHelpers(context);

    function submitEdit(): void {
      if (state.valid) {
        editActionDisabled.value = true;
        if (store.state.client.dialogView === DIALOG_ROUTES.NEW_SONG_DIALOG) {
          socket.emit(
            SHARED_EVENTS.ADMIN_NEW_SONG,
            store.state.admin.songInEdit,
            (proceed: boolean) => {
              editActionComplete(proceed);
            }
          );
        } else if (store.state.client.dialogView === DIALOG_ROUTES.EDIT_SONG_DIALOG) {
          socket.emit(
            SHARED_EVENTS.ADMIN_EDIT_SONG,
            store.state.admin.songInEdit,
            (proceed: boolean) => {
              editActionComplete(proceed);
            }
          );
        }
      }
    }

    return {
      ...toRefs(state),
      submitEdit,
      updateAnimeIds,
      updateTitle,
      updateArtist,
      updateSource,
      updateType,
      editActionDisabled
    };
  }
});
</script>
