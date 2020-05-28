<template>
  <v-col cols="10">
    <v-select
      v-bind="$attrs"
      :value="value"
      @input="$emit('input', $event)"
      class="dialog-item"
      outlined
      dense
    >
      <template #item="{item}">
        <slot name="item" :item="item">
          {{item}}
        </slot>
      </template>

      <template #selection="{item}">
        <slot name="selection" :item="item">
          {{item}}
        </slot>
      </template>
    </v-select>
  </v-col>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'

  export default defineComponent({
    props: {
      value: {
        required: true
      }
    }
  })
</script>
