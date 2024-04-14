<template>
  <v-snackbar location="top" :timeout="6000" :color="color" v-model="show">
    {{ message }}
    <template #actions>
      <v-btn icon="mdi-close" @click="show = false" variant="text" density="comfortable" size="small"></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { CLIENT_EVENTS } from '@/assets/events';
import { TNotificationColor } from 'anime-quiz-shared-resources/src/models/types';
import { TRegisterSendNotification } from '@/assets/types';

const message = ref('');
const show = ref(false);
const color = ref<TNotificationColor>('error');

function _showNotification(_color: TNotificationColor, _message: string): void {
  color.value = _color;
  message.value = _message;
  show.value = true;
}

function sendNotification(color: TNotificationColor, message: string): void {
  if (show.value) {
    show.value = false;
    setTimeout((): void => {
      _showNotification(color, message);
    }, 100);
  } else {
    _showNotification(color, message);
  }
}

const registerSendNotification = inject(CLIENT_EVENTS.REGISTER_SEND_NOTIFICATION) as TRegisterSendNotification;
registerSendNotification(sendNotification);
</script>
