<template>
  <v-row justify="center" no-gutters>
    <v-col cols="12">
      <v-slider
        :min="min"
        :max="max"
        v-bind="$attrs"
        :value="value"
        @input="$emit('input', $event)"
        outlined
        :disabled="disabled"
      >
        <template #append>
          <v-text-field
            :value="value"
            @input="$emit('input', $event)"
            type="number"
            single-line
            hide-details
            outlined
            dense
            class="mt-0 pt-0"
            style="width: 100px"
            :min="min"
            :max="max"
            :disabled="disabled"
          ></v-text-field>
        </template>
      </v-slider>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    value: {
      required: true
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: (): boolean => {
        return false
      }
    }
  }
})
</script>
