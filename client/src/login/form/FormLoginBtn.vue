<template>
  <v-row justify="center" no-gutters>
    <v-col cols="auto">
      <icon-btn
        color="success"
        icon="mdi-login"
        v-bind="$attrs"
        @click="$emit('click')"
      >Login</icon-btn>
    </v-col>
  </v-row>
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
