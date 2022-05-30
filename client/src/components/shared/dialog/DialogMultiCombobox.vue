<template>
  <v-row justify="center" no-gutters>
    <v-col cols="12">
      <v-combobox
        outlined
        multiple
        v-bind="$attrs"
        :value="value"
        @input="$emit('input', $event)"
        chips
      >
        <template #selection="{ parent, item }">
          <v-chip close color="primary" @click:close="parent.selectItem(item)">
            {{ item }}
          </v-chip>
        </template>
      </v-combobox>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    value: {
      required: true
    }
  }
})
</script>
