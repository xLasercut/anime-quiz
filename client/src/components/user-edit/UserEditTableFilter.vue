<template>
  <v-row dense>
    <v-col>
      <v-text-field
        dense
        outlined
        :value="userIdFilter"
        @input="updateFilter('user-is-filter', $event)"
        label="User ID"
        hide-details
        clearable
      ></v-text-field>
    </v-col>
    <v-col>
      <v-text-field
        dense
        outlined
        :value="usernameFilter"
        @input="updateFilter('username-filter', $event)"
        label="Username"
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
    userIdFilter: {
      required: true
    },
    usernameFilter: {
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
