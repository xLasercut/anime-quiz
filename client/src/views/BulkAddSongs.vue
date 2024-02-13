<template>
  <v-form v-model="loadSongsValid" @submit.prevent="loadSongs()">
    <v-row :dense="true">
      <v-col cols="12">
        <v-card variant="flat">
          <v-container :fluid="true">
            <dialog-multi-anime-autocomplete v-model="anime"></dialog-multi-anime-autocomplete>
            <dialog-text-field label="Anime Slug" v-model.trim="animeSlug" :rules="animeSlugRules"></dialog-text-field>
            <v-row :dense="true">
              <v-col cols="auto">
                <icon-btn icon="mdi-reload" color="warning" type="submit" :disabled="!loadSongsValid">Load Songs </icon-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
  <v-form v-model="addSongsValid" @submit.prevent="addSongs()">
    <v-row :dense="true">
      <v-col cols="6" v-for="(_, index) in songs">
        <bulk-add-song-song-info
          v-model:anime-id="songs[index].animeId"
          v-model:song-id.trim="songs[index].songId"
          v-model:song-title.trim="songs[index].songTitle"
          v-model:src.trim="songs[index].src"
          v-model:artist.trim="songs[index].artist"
          v-model:type.trim="songs[index].type"
          :disabled="disabled"
        ></bulk-add-song-song-info>
      </v-col>
    </v-row>
    <v-row :dense="true">
      <v-col cols="auto">
        <icon-btn icon="mdi-check" color="success" type="submit" :disabled="disabled || !addSongsValid" v-show="showAddSongsButton"
          >Add Songs
        </icon-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import DialogMultiAnimeAutocomplete from '@/components/common/dialogs/DialogMultiAnimeAutocomplete.vue';
import { computed, ref } from 'vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import axios from 'axios';
import { SongType } from '@/assets/shared/models/types';
import { AnimeThemesResponse, AnimeThemesResponseString } from '@/assets/models';
import { AnimeThemesResponseAnimeThemeType } from '@/assets/types';
import BulkAddSongSongInfo from '@/components/bulk-add-songs/BulkAddSongSongInfo.vue';
import { canParseValue, generateId } from '@/assets/game-helpers';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';

const anime = ref([]);
const animeSlug = ref('');
const songs = ref<SongType[]>([]);
const loadSongsValid = ref(false);
const addSongsValid = ref(false);
const disabled = ref(false);

const animeSlugRules = [
  (v: string): boolean | string => !!v || 'Anime Slug required',
  (v: string): boolean | string => canParseValue(v, AnimeThemesResponseString) || 'Invalid Anime Slug'
];

async function loadSongs() {
  if (!loadSongsValid.value) {
    return;
  }

  const url = `https://api.animethemes.moe/anime/${animeSlug.value}?include=animethemes.animethemeentries.videos,animethemes.song,animethemes.song.artists`;
  const response = await axios.get(url);
  const parsedResponse = AnimeThemesResponse.parse(response.data);

  songs.value = [];

  for (const animeTheme of parsedResponse.anime.animethemes) {
    songs.value.push({
      songId: generateId('song'),
      src: getVideoLink(animeTheme),
      type: animeTheme.type,
      songTitle: animeTheme.song.title,
      artist: getArtist(animeTheme),
      animeId: anime.value,
      animeName: []
    });
  }
}

function getArtist(animeTheme: AnimeThemesResponseAnimeThemeType): string {
  return animeTheme.song.artists
    .map((artist) => {
      return artist.name;
    })
    .join(' & ');
}

function getVideoLink(animeTheme: AnimeThemesResponseAnimeThemeType): string {
  for (const entry of animeTheme.animethemeentries) {
    for (const video of entry.videos) {
      if (video.resolution === 720) {
        return video.link;
      }
    }
  }
  return animeTheme.animethemeentries[0].videos[0].link;
}

const showAddSongsButton = computed(() => {
  return songs.value.length > 0;
});

async function addSongs() {
  if (!addSongsValid.value) {
    return;
  }

  disabled.value = true;

  try {
    for (const song of songs.value) {
      await sendAddSongRequest(song);
    }
    disabled.value = false;
  } catch (e) {
    disabled.value = false;
    console.log('failed to add song');
  }
}

async function sendAddSongRequest(song: SongType): Promise<void> {
  return new Promise((resolve, reject) => {
    socket.emit(SOCKET_EVENTS.ADMIN_NEW_SONG, song, (success: boolean) => {
      if (success) {
        resolve();
      } else {
        reject(song);
      }
    });
  });
}
</script>
