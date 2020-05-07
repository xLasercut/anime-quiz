<template>
  <v-dialog :value="value" @input="$emit('input', $event)" width="600px">
    <v-card>
      <v-container fluid>
        <v-row justify="space-between" no-gutters>
          <v-col cols="auto">
            {{label}}
          </v-col>
          <v-col cols="auto">
            <v-btn icon text small @click="$emit('dialog:close')">
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
  import {defineComponent} from '@vue/composition-api'

  export default defineComponent({
    props: {
      label :{
        default: ''
      },
      value: {
        required: true
      }
    }
  })
</script>
