<template>
  <v-dialog v-model="show" width="600px">
    <v-card>
      <v-container fluid>
        <v-row justify="space-between" no-gutters>
          <v-col cols="auto">
            {{label}}
          </v-col>
          <v-col cols="auto">
            <v-btn icon text small @click="show = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <slot></slot>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {defineComponent, reactive, toRefs, watch} from '@vue/composition-api'

  export default defineComponent({
    props: {
      label :{
        default: ''
      },
      value: {
        required: true
      }
    },
    setup(props, context) {
      const state = reactive({
        show: props.value
      })

      watch(() => props.value, (val): void => {
        state.show = val
      })

      watch(() => state.show, (val): void => {
        context.emit('input', val)
      })

      return {...toRefs(state)}
    }
  })
</script>
