<template>
  <v-snackbar location="top" :timeout="6000" :color="color" v-model="show">
    {{ message }}
    <template #actions>
      <v-btn icon="mdi-close" @click="show = false" variant="text" density="comfortable" size="small"></v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, toRefs } from 'vue';
import { CLIENT_EVENTS } from '@/assets/events';

export default defineComponent({
  setup() {
    const state = reactive({
      message: '',
      show: false,
      color: 'error'
    });

    function _showNotification(color: string, message: string): void {
      state.color = color;
      state.message = message;
      state.show = true;
    }

    function sendNotification(color: string, message: string): void {
      if (state.show) {
        state.show = false;
        setTimeout((): void => {
          _showNotification(color, message);
        }, 100);
      } else {
        _showNotification(color, message);
      }
    }

    const registerSystemNotification = inject<Function>(CLIENT_EVENTS.REGISTER_SYSTEM_NOTIFICATION);
    if (registerSystemNotification) {
      registerSystemNotification(sendNotification);
    }

    return { ...toRefs(state) };
  }
});
</script>
