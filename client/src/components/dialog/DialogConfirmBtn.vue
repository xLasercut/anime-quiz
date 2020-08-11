<template>
  <v-col cols="auto">
    <icon-btn color="success" type="submit" icon="mdi-check" v-bind="$attrs">Confirm</icon-btn>
  </v-col>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import IconBtn from '@/components/buttons/IconBtn.vue'

export default defineComponent({
  components: {
    IconBtn
  }
})
</script>
