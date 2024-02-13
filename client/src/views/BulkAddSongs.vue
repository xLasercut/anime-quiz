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
                <icon-btn icon="mdi-reload" color="warning" type="submit" :disabled="disabled || !loadSongsValid">Load Songs </icon-btn>
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
          v-model:audio-src.trim="songs[index].audioSrc"
          :disabled="disabled"
          @remove-song="removeSong($event)"
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
import { computed, inject, ref } from 'vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import axios from 'axios';
import { AnimeThemesResponseAnimeThemeType, AnimeThemesResponseVideoType, SongIdType, SongType } from '@/assets/shared/models/types';
import { SendNotification } from '@/assets/types';
import BulkAddSongSongInfo from '@/components/bulk-add-songs/BulkAddSongSongInfo.vue';
import { canParseValue, generateId } from '@/assets/game-helpers';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { CLIENT_EVENTS } from '@/assets/events';
import { AnimeThemesResponse, AnimeThemesResponseString } from '@/assets/shared/models/anime-themes';

interface SongSrc {
  video: string;
  audio: string;
}

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

const sendNotification = inject(CLIENT_EVENTS.SYSTEM_NOTIFICATION) as SendNotification;

async function loadSongs() {
  if (!loadSongsValid.value) {
    return;
  }

  disabled.value = true;

  try {
    const url = `https://api.animethemes.moe/anime/${animeSlug.value}?include=animethemes.animethemeentries.videos,animethemes.song,animethemes.song.artists,animethemes.animethemeentries.videos.audio`;
    const response = await axios.get(url);
    const parsedResponse = AnimeThemesResponse.parse(response.data);

    songs.value = [];

    for (const animeTheme of parsedResponse.anime.animethemes) {
      const songSrc = getSongSrc(animeTheme);
      songs.value.push({
        songId: generateId('song'),
        src: songSrc.video,
        type: animeTheme.type,
        songTitle: animeTheme.song.title,
        artist: getArtist(animeTheme),
        animeId: anime.value,
        animeName: [],
        audioSrc: songSrc.audio
      });
    }
    disabled.value = false;
  } catch (e) {
    disabled.value = false;
    console.error(e);
    sendNotification('error', 'Failed to generate songs to add. See console log');
  }
}

function getArtist(animeTheme: AnimeThemesResponseAnimeThemeType): string {
  if (animeTheme.song.artists.length <= 0) {
    return '';
  }

  return animeTheme.song.artists
    .map((artist) => {
      return artist.name;
    })
    .join(' & ');
}

function getSongSrc(animeTheme: AnimeThemesResponseAnimeThemeType): SongSrc {
  let videos: AnimeThemesResponseVideoType[] = [];

  for (const entry of animeTheme.animethemeentries) {
    videos = videos.concat(entry.videos);
  }

  if (videos.length <= 0) {
    return {
      video: '',
      audio: ''
    };
  }

  for (const video of videos) {
    if (video.resolution === 720) {
      return {
        video: video.link,
        audio: video.audio.link || ''
      };
    }
  }

  return {
    video: animeTheme.animethemeentries[0].videos[0].link,
    audio: animeTheme.animethemeentries[0].videos[0].audio.link || ''
  };
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
    console.error(e);
    sendNotification('error', 'Failed to add songs. See console log');
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

function removeSong(songId: SongIdType) {
  const songIds = songs.value.map((song) => song.songId);
  const indexToRemove = songIds.indexOf(songId);
  songs.value.splice(indexToRemove, 1);
}
</script>
