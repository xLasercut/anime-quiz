<template>
  <v-row dense>
    <v-col>
      <v-text-field
        dense
        outlined
        :value="animeIdFilter"
        @input="updateFilter('anime-id-filter', $event)"
        label="Anime ID"
        hide-details
        clearable
      ></v-text-field>
    </v-col>
    <v-col>
      <v-text-field
        :value="animeNameFilter"
        @input="updateFilter('anime-name-filter', $event)"
        dense
        outlined
        label="Name"
        hide-details
        clearable
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { newTableHelpers } from '../../assets/table-helper'

export default defineComponent({
  props: {
    animeIdFilter: {
      required: true
    },
    animeNameFilter: {
      required: true
    }
  },
  setup(_props, context) {
    const { updateFilter } = newTableHelpers(context)

    return {
      updateFilter
    }
  }
})
</script>
