<template>
  <v-main>
    <v-row>
      <v-col>
        <v-card variant="text">
          <v-card-title>
            Game Room
          </v-card-title>
          <v-card-text>
            Play anime quiz
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-row justify="end">
              <v-col cols="auto">
                <v-btn
                  @click=""
                  size="x-large"
                  color="success"
                  flat
                  append-icon="mdi-login"
                >Go</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card variant="text">
          <v-card-title>
            Song List
          </v-card-title>
          <v-card-text>
            Add/Remove songs from your song list
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-row justify="end">
              <v-col cols="auto">
                <v-btn
                  @click="openSongList()"
                  size="x-large"
                  color="primary"
                  flat
                  append-icon="mdi-login"
                >Go</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script setup lang="ts">
import {socket} from '../plugins/socket'
import {ref} from 'vue'
import {useStore} from 'vuex'
import {MUTATIONS} from '../plugins/store/mutations'
import {ROUTES} from '../plugins/routing/routes'

const store = useStore()

function openSongList() {
  store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.SONG_LIST)
}
</script>
