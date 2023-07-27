<template>
  <v-row justify="end" :dense="true">
    <v-col cols="auto">
      <icon-btn :disabled="disabled" color="error" @click="$emit('dialog:close')" icon="mdi-close">
        Cancel
      </icon-btn>
    </v-col>
    <v-col cols="auto">
      <icon-btn :disabled="disabled" icon="mdi-check" color="success" type="submit">
        Confirm
      </icon-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IconBtn from '@/components/common/buttons/IconBtn.vue';

export default defineComponent({
  components: { IconBtn },
  props: {
    disabled: {
      type: Boolean,
      default: (): boolean => {
        return false;
      }
    }
  }
});
</script>
