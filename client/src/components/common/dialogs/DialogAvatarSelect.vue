<template>
  <v-row justify="center" :dense="true">
    <v-col cols="12">
      <v-select variant="outlined" label="Avatar" v-bind="$attrs" :items="avatars" density="compact">
        <template #item="{ item, props }">
          <v-list-item v-bind="props">
            <template #prepend>
              <game-avatar :size="avatarSize" :avatar="item.raw"></game-avatar>
            </template>
            <v-list-item-title v-text="item.raw"></v-list-item-title>
          </v-list-item>
        </template>

        <template #selection="{ item }">
          <v-list-item>
            <template #prepend>
              <game-avatar :size="avatarSize" :avatar="item.raw"></game-avatar>
            </template>
            <v-list-item-title v-text="item.raw"></v-list-item-title>
          </v-list-item>
        </template>
      </v-select>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import GameAvatar from '@/components/common/GameAvatar.vue';
import { AVATARS } from 'anime-quiz-shared-resources';

defineProps({
  avatarSize: {
    type: String,
    default: (): string => {
      return '100';
    }
  }
});
const avatars = Object.values(AVATARS).sort();
</script>
