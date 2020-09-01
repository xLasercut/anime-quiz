<template>
  <v-col cols="10">
    <v-slider
      :min="min" :max="max" :disabled="disabled"
      v-model.number="model"
      v-bind="$attrs"
    >
      <template #append>
        <v-text-field
          outlined dense class="dialog-item mt-0 pt-0" type="number"
          :min="min" :max="max" :disabled="disabled"
          v-model.number="model"
          hide-details :style="{width: '80px'}"
        ></v-text-field>
      </template>
    </v-slider>
  </v-col>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch} from '@vue/composition-api'

export default defineComponent({
  props: {
    min: {
      required: true
    },
    max: {
      required: true
    },
    disabled: {
      default: false
    },
    value: {
      required: true
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

<style scoped>

</style>
