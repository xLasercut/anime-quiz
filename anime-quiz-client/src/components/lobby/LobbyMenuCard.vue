<template>
  <v-card flat>
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-text>
      {{ description }}
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-row justify="end">
        <v-col cols="auto">
          <icon-btn
            :color="color"
            icon="mdi-login"
            large
            @click="$emit('click')"
          >Go</icon-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import IconBtn from '../shared/buttons/IconBtn.vue'

export default defineComponent({
  components: {IconBtn},
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  }
})
</script>
