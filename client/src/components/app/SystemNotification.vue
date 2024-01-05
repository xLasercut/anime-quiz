<template>
  <v-snackbar location="top" :timeout="6000" :color="color" v-model="show">
    {{ message }}
    <template #actions>
      <v-btn icon="mdi-close" @click="show = false" variant="text" density="comfortable" size="small"></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import {inject, ref} from 'vue';
import {CLIENT_EVENTS} from '@/assets/events';
import {NotificationColorType} from '@/assets/shared/models/types';
import {RegisterSendNotification} from '@/assets/types';

const message = ref('')
const show = ref(false)
const color = ref<NotificationColorType>('error')


function _showNotification(_color: NotificationColorType, _message: string): void {
  color.value = _color;
  message.value = _message;
  show.value = true;
}

function sendNotification(color: NotificationColorType, message: string): void {
  if (show.value) {
    show.value = false;
    setTimeout((): void => {
      _showNotification(color, message);
    }, 100);
  } else {
    _showNotification(color, message);
  }
}

const registerSendNotification = inject(CLIENT_EVENTS.REGISTER_SEND_NOTIFICATION) as RegisterSendNotification;
registerSendNotification(sendNotification);
</script>
