<template>
  <v-card variant="flat" :title="title">
    <template #prepend>
      <v-icon :color="color" left large>{{ icon }}</v-icon>
    </template>
    <v-card-text>
      {{ description }}
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-row justify="end">
        <v-col cols="auto">
          <icon-btn :color="color" icon="mdi-login" large @click="$emit('click')">Go</icon-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IconBtn from '@/components/common/buttons/IconBtn.vue';

export default defineComponent({
  emits: ['click'],
  components: { IconBtn },
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }
});
</script>
