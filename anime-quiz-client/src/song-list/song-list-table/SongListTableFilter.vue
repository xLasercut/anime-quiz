<template>
  <v-form @submit="updateFilter()">
    <v-row dense>
      <v-col>
        <v-autocomplete
          density="compact"
          v-model="state.animeFilter"
          variant="outlined"
          label="Anime"
          :items="animes()"
        ></v-autocomplete>
      </v-col>
      <v-col>
        <v-text-field density="compact" variant="outlined" label="Song"></v-text-field>
      </v-col>
      <v-col>
        <v-select density="compact" variant="outlined" label="Type"></v-select>
      </v-col>
      <v-col cols="auto">
        <v-btn color="success" type="submit" flat append-icon="mdi-search">Search</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import {useStore} from 'vuex'
import {MUTATIONS} from '../../plugins/store/mutations'

const store = useStore()

const state = reactive({
  animeFilter: store.state.songList.animeFilter,
  items: [
    'test',
    'google'
  ]
})

function animes() {
  return store.state.songList.animeList.map(anime => anime.anime_name)
}

function updateFilter(): void {
  console.log(store.state.songList.animeList)
  store.commit(MUTATIONS.UPDATE_SONG_LIST_ANIME_FILTER, state.animeFilter)
}
</script>
