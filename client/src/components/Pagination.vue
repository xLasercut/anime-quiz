<template>
  <v-row justify="center">
    <v-col cols="10">
      <v-pagination :length="maxPage" :value="value" @input="$emit('input', $event)" total-visible="10"></v-pagination>
    </v-col>
    <v-col cols="2">
      <v-select class="mt-0 pt-0" outlined dense hide-details :items="items" v-model="rowsPerPage"></v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch} from '@vue/composition-api'

export default defineComponent({
  props: {
    value: {
      required: true
    },
    maxPage: {
      required: true
    },
    items: {
      required: true
    },
    itemsPerPage: {
      required: true
    }
  },
  setup(props, context) {
    const state = reactive({
      rowsPerPage: props.itemsPerPage
    })

    watch(() => state.rowsPerPage, (val) => {
      context.emit('update:itemsPerPage', val)
    })

    return {...toRefs(state)}
  }
})
</script>
