<template>
  <v-card :flat="true" :color="cardColor">
    <v-card-title>
      <v-row justify="space-between">
        <v-col cols="auto">
          <span>Song</span>
        </v-col>
        <v-col cols="auto">
          <v-btn icon="mdi-close" variant="text" density="comfortable" size="small" @click="$emit('removeSong', songId)"></v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-container :fluid="true">
      <dialog-text-field
        label="Song ID"
        :model-value="songId"
        @update:model-value="$emit('update:songId', $event)"
        append-icon="mdi-refresh"
        :rules="SONG_ID_RULES"
        :disabled="disabled"
        @click:append="regenerateSongId()"
      ></dialog-text-field>
      <dialog-multi-anime-autocomplete :model-value="animeId" :disabled="true"></dialog-multi-anime-autocomplete>
      <dialog-text-field
        label="Title"
        :model-value="songTitle"
        @update:model-value="$emit('update:songTitle', $event)"
        :rules="SONG_TITLE_RULES"
        :disabled="disabled"
      ></dialog-text-field>
      <dialog-text-field
        label="Src"
        :model-value="src"
        @update:model-value="$emit('update:src', $event)"
        :rules="SONG_SRC_RULES"
        :disabled="disabled"
      ></dialog-text-field>
      <dialog-text-field
        label="Audio Src"
        :model-value="audioSrc"
        @update:model-value="$emit('update:audioSrc', $event)"
        :disabled="disabled"
      ></dialog-text-field>
      <dialog-text-field
        label="Artist"
        :model-value="artist"
        @update:model-value="$emit('update:artist', $event)"
        :disabled="disabled"
      ></dialog-text-field>
      <dialog-select
        label="Type"
        :model-value="type"
        @update:model-value="$emit('update:type', $event)"
        :disabled="disabled"
        :items="songTypes"
        :rules="SONG_TYPE_RULES"
      ></dialog-select>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import { SONG_ID_RULES, SONG_SRC_RULES, SONG_TITLE_RULES, SONG_TYPE_RULES } from '@/assets/form-rules';
import DialogSelect from '@/components/common/dialogs/DialogSelect.vue';
import DialogMultiAnimeAutocomplete from '@/components/common/dialogs/DialogMultiAnimeAutocomplete.vue';
import { SONG_TYPES, TAnimeId, TSongId, TSongTitle, TSongType } from 'anime-quiz-shared-resources';
import { computed, PropType } from 'vue';
import { generateId } from '@/assets/game-helpers';
import { useDataStore } from '@/plugins/store/data';

const dataStore = useDataStore();

const props = defineProps({
  disabled: {
    type: Boolean,
    required: true
  },
  songId: {
    type: String as PropType<TSongId>,
    required: true
  },
  animeId: {
    type: Array as PropType<TAnimeId[]>,
    required: true
  },
  songTitle: {
    type: String as PropType<TSongTitle>,
    required: true
  },
  src: {
    type: String,
    required: true
  },
  artist: {
    type: String as PropType<string | null>,
    required: true,
    default: (): string => {
      return '';
    }
  },
  audioSrc: {
    type: String as PropType<string | null>,
    required: true,
    default: (): string => {
      return '';
    }
  },
  type: {
    type: String as PropType<TSongType>,
    required: true
  }
});

const emit = defineEmits([
  'update:songId',
  'update:songTitle',
  'update:src',
  'update:artist',
  'update:type',
  'removeSong',
  'update:audioSrc'
]);

const songTypes = Object.values(SONG_TYPES);

function regenerateSongId() {
  emit('update:songId', generateId('song'));
}

const cardColor = computed(() => {
  const filteredSongs = dataStore.songList.filter((song) => {
    if (song.src === props.src) {
      return true;
    }
  });
  if (filteredSongs.length > 0) {
    return 'warning';
  }

  return '';
});
</script>
