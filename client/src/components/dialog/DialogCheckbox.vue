<template>
  <v-col cols="10">
    <v-row justify="center">
      <v-col cols="auto" v-for="item in items">
        <v-checkbox v-bind="item" v-model="model" :disabled="disabled"></v-checkbox>
      </v-col>
    </v-row>
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
      },
      disabled: {
        default: false
      }
    },
    setup(props, context) {
      const state = reactive({
        model: props.value
      })

      watch(() => props.value, (val) => {
        state.model = val
      })

      watch(() => state.model, (val) => {
        context.emit('input', val)
      })

      return {...toRefs(state)}
    }
  })
</script>
