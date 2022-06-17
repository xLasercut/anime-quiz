<template>
  <v-row justify="center" no-gutters>
    <v-col cols="12">
      <v-autocomplete
        outlined
        multiple
        v-bind="$attrs"
        :value="value"
        @input="$emit('input', $event)"
        chips
      >
        <template #selection="{ parent, item }">
          <v-chip close color="primary" @click:close="parent.selectItem(item)">
            {{ item.anime_name.join(',') }}
          </v-chip>
        </template>
      </v-autocomplete>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    value: {
      required: true
    }
  }
});
</script>
