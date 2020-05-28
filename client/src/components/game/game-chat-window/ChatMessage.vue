<template>
  <div class="message-row">
    <div class="avatar-container">
      <v-avatar>
        <v-img></v-img>
      </v-avatar>
    </div>
    <div>

    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'

  export default defineComponent({
    props: {
      message: {
        required: true
      }
    }
  })
</script>
