<template>
  <v-row justify="center">
    <v-col cols="12" sm="7">
      <v-select
        filled
        label="Avatar"
        v-bind="$attrs"
        :value="value"
        @input="$emit('input', $event)"
        :items="items"
      >
        <template #item="{ item }">
          <v-list-item-avatar :size="avatarSize">
            <game-avatar :size="avatarSize" :avatar="item"></game-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            {{ item }}
          </v-list-item-content>
        </template>

        <template #selection="{ item }">
          <v-list-item-avatar :size="avatarSize">
            <game-avatar :size="avatarSize" :avatar="item"></game-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            {{ item }}
          </v-list-item-content>
        </template>
      </v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { getAvatarSelect } from '../../assets/avatar';
import GameAvatar from '../shared/GameAvatar.vue';

export default defineComponent({
  components: { GameAvatar },
  props: {
    value: {
      required: true
    }
  },
  setup() {
    const state = reactive({
      items: getAvatarSelect(),
      avatarSize: '100'
    });

    return {
      ...toRefs(state)
    };
  }
});
</script>

<style scoped>
img {
  border: 1px solid black;
}
</style>
