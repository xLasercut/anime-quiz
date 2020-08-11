<template>
  <v-main>
    <v-card flat>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="auto">
            <icon-btn icon="mdi-plus" color="success" @click="openDialog(null)">Add Song</icon-btn>
          </v-col>
        </v-row>
        <amq-song-list-table
          @admin:edit="openDialog($event)"
          @admin:delete="deleteGameSong($event)"
          @user:add="addUserSong($event)"
          @user:delete="deleteUserSong($event)"
        ></amq-song-list-table>
        <game-dialog v-model="show" label="Song Editor">
          <v-form v-model="valid" @submit.prevent="confirmSongEdit()">
            <v-row justify="center" dense>
              <dialog-multi-select
                label="Anime"
                :items="$store.state.amq.choices.anime"
                v-model="form.anime"
                :rules="animeRules"
              ></dialog-multi-select>
              <dialog-text
                label="Source"
                v-model.trim="form.src"
                :rules="srcRules"
              ></dialog-text>
              <dialog-text
                label="Title"
                v-model.trim="form.title"
                :rules="titleRules"
              ></dialog-text>
              <dialog-text
                label="Artist"
                v-model.trim="form.artist"
              ></dialog-text>
              <dialog-text
                label="Type"
                v-model.trim="form.type"
                :rules="typeRules"
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
import AmqSongListTable from '@/amq-song/AmqSongListTable.vue'
import GameDialog from '@/components/GameDialog.vue'
import DialogMultiSelect from '@/components/dialog/DialogMultiSelect.vue'
import DialogText from '@/components/dialog/DialogText.vue'
import {IAmqSong} from '../../../shared/interfaces/database'
import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'
import IconBtn from '@/components/buttons/IconBtn.vue'
import {socket} from '@/assets/socket'

export default defineComponent({
  components: {
    AmqSongListTable, GameDialog, DialogMultiSelect, DialogText, DialogConfirmBtn, IconBtn
  },
  setup(_props, context) {
    const state = reactive({
      show: false,
      valid: false,
      form: Object.assign({}, getDefaultForm()),
      isEdit: false,
      srcRules: [
        (v: string): boolean | string => (!!v) || 'Source cannot be empty'
      ],
      titleRules: [
        (v: string): boolean | string => (!!v) || 'Title cannot be empty'
      ],
      typeRules: [
        (v: string): boolean | string => (!!v) || 'Type cannot be empty'
      ],
      animeRules: [
        (v: Array<string>): boolean | string => v.length > 0 || 'Anime cannot be empty'
      ]
    })

    function getDefaultForm(): IAmqSong {
      return {
        anime: [],
        title: '',
        src: '',
        artist: '',
        type: '',
        songId: ''
      }
    }

    function openDialog(song: IAmqSong | null = null): void {
      if (song) {
        state.form = Object.assign({}, song)
        state.isEdit = true
      }
      else {
        state.form = Object.assign({}, getDefaultForm())
        state.isEdit = false
      }
      state.show = true
    }

    function confirmSongEdit(): void {
      if (state.valid && state.show) {
        if (state.isEdit) {
          socket.emit('EDIT_AMQ_GAME_SONG', state.form)
        }
        else {
          socket.emit('ADD_AMQ_GAME_SONG', state.form)
        }
        state.show = false
      }
    }

    function deleteGameSong(song: IAmqSong): void {
      socket.emit('DELETE_AMQ_GAME_SONG', song)
    }

    function addUserSong(song: IAmqSong): void {
      socket.emit('ADD_AMQ_USER_SONG', song, context.root.$store.state.amq.currentUser)
    }

    function deleteUserSong(song: IAmqSong): void {
      socket.emit('DELETE_AMQ_USER_SONG', song, context.root.$store.state.amq.currentUser)
    }

    return {...toRefs(state), openDialog, confirmSongEdit, deleteGameSong, addUserSong, deleteUserSong}
  }
})
</script>
