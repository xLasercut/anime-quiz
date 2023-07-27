<template>
  <v-row justify="center" :dense="true">
    <v-col cols="12">
      <v-select variant="outlined" label="Avatar" v-bind="$attrs" :items="avatars" density="comfortable">
        <template #item="{ item, props }">
          <v-list-item @click="props.onClick">
            <template #prepend>
              <game-avatar :size="avatarSize" :avatar="item.title"></game-avatar>
            </template>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </template>

        <template #selection="{ item }">
          <v-list-item>
            <template #prepend>
              <game-avatar :size="avatarSize" :avatar="item.title"></game-avatar>
            </template>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </template>
      </v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import GameAvatar from '@/components/common/GameAvatar.vue';
import { AVATARS } from '@/assets/shared/avatars';

export default defineComponent({
  components: { GameAvatar },
  setup(props) {
    const state = reactive({
      avatars: Object.values(AVATARS),
      avatarSize: '100'
    });

    return {
      ...toRefs(state)
    };
  }
});
</script>
