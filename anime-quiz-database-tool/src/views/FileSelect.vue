<template>
  <v-main>
    <v-form v-model="valid" @submit.native.prevent="confirm()">
      <v-row justify="center">
        <v-col>
          <v-text-field filled clearable label="Song DB" :rules="rules" v-model.trim="songDbPath"></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col>
          <v-text-field filled clearable label="User DB" :rules="rules" v-model.trim="userDbPath"></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="auto">
          <icon-btn color="success" icon="mdi-login" type="submit">Confirm</icon-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import IconBtn from '../components/shared/buttons/IconBtn.vue'
import { LOCAL_STORAGE_CONSTANTS } from '../assets/shared/constants'
import { DbPaths } from '../assets/interfaces'
import { store } from '../plugins/store'
import { MUTATIONS } from '../plugins/store/mutations'

export default defineComponent({
  components: { IconBtn },
  setup() {
    const state = reactive({
      songDbPath: localStorage[LOCAL_STORAGE_CONSTANTS.SONG_DB_PATH] || '',
      userDbPath: localStorage[LOCAL_STORAGE_CONSTANTS.USER_DB_PATH] || '',
      valid: false,
      rules: [
        (v: string) => !!v || 'Path required'
      ]
    })

    function confirm(): void {
      if (state.valid) {
        localStorage[LOCAL_STORAGE_CONSTANTS.SONG_DB_PATH] = state.songDbPath
        localStorage[LOCAL_STORAGE_CONSTANTS.USER_DB_PATH] = state.userDbPath
        const paths: DbPaths = {
          userDbPath: state.userDbPath,
          songDbPath: state.songDbPath
        }
        store.commit(MUTATIONS.UPDATE_DB_PATH, paths)
      }
    }

    return {
      ...toRefs(state),
      confirm
    }
  }
})
</script>
