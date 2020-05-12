<template>
  <v-container fluid>
    <nav-panel show-home>
      <list-picker-controls></list-picker-controls>
    </nav-panel>
    <v-content>
      <v-card flat>
        <v-container fluid>
          <v-row justify="center" v-if="$store.state.client.admin">
            <v-col cols="auto">
              <icon-btn icon="mdi-plus" color="success" @click="openDialog(null)">Add Song</icon-btn>
            </v-col>
          </v-row>
          <song-list-table
            @user:add="addUserSong($event)"
            @user:delete="deleteUserSong($event)"
            @admin:edit="openDialog($event)"
            @admin:delete="deleteGameSong($event)"
          ></song-list-table>
          <game-dialog
            v-model="show" label="Song Editor"
            @dialog:close="show = false"
          >
            <v-form v-model="valid" @submit.prevent="confirmSongEdit()">
              <v-row justify="center">
                <dialog-multi-select
                  :items="$store.state.list.choices.anime"
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
                <dialog-confirm-btn
                  :disabled="!valid"
                ></dialog-confirm-btn>
              </v-row>
            </v-form>
          </game-dialog>
        </v-container>
      </v-card>
    </v-content>
  </v-container>
</template>

<script lang="ts">
  import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
  import NavPanel from '@/components/NavPanel.vue'
  import ListPickerControls from '@/list-picker/ListPickerControls.vue'
  import {socket} from '@/assets/socket'
  import SongListTable from '@/list-picker/SongListTable.vue'
  import GameDialog from '@/components/GameDialog.vue'
  import DialogText from '@/components/dialog/DialogText.vue'
  import IconBtn from '@/components/buttons/IconBtn.vue'
  import DialogMultiSelect from '@/components/dialog/DialogMultiSelect.vue'
  import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'
  import {ISong} from '../../../shared/interfaces/database'

  export default defineComponent({
    components: {
      NavPanel, ListPickerControls, SongListTable,
      GameDialog, DialogText, IconBtn, DialogMultiSelect, DialogConfirmBtn
    },
    setup(_props, context) {
      const state = reactive({
        show: false,
        form: Object.assign({}, getDefaultForm()),
        valid: false,
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

      function getDefaultForm(): ISong {
        return {
          anime: [],
          title: '',
          src: '',
          artist: '',
          type: '',
          songId: ''
        }
      }

      function openDialog(song: ISong | null = null): void {
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
            socket.emit('EDIT_GAME_SONG', state.form)
          }
          else {
            socket.emit('ADD_GAME_SONG', state.form)
          }
          state.show = false
        }
      }

      function deleteGameSong(song: ISong): void {
        socket.emit('DELETE_GAME_SONG', song)
      }

      function addUserSong(song: ISong): void {
        socket.emit('ADD_USER_SONG', song, context.root.$store.state.list.currentUser)
      }

      function deleteUserSong(song: ISong): void {
        socket.emit('DELETE_USER_SONG', song, context.root.$store.state.list.currentUser)
      }

      onMounted(() => {
        if (socket.disconnected) {
          context.root.$router.push('/login')
        }

        socket.on('disconnect', (): void => {
          context.root.$router.push('/login')
        })
      })

      return {...toRefs(state), openDialog, addUserSong, deleteUserSong, confirmSongEdit, deleteGameSong}
    }
  })
</script>
