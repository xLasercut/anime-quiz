<template>
  <v-col cols="10">
    <v-radio-group
      v-bind="$attrs"
      v-model="model"
    >
      <v-radio v-for="item in items" v-bind="item"></v-radio>
    </v-radio-group>
  </v-col>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch} from '@vue/composition-api'

export default defineComponent({
  props: {
    items: {
      required: true
    },
    value: {
      required: true
    }
  },
  setup(props, context) {
    const state = reactive({
      model: props.value
    })

    watch(() =>  state.model, (val) => {
      context.emit('input', val)
    })

    watch(() => props.value, (val) => {
      state.model = val
    })

    return {...toRefs(state)}
  }
})
</script>
