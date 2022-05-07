<template>
  <v-main>
    <v-row justify="center">
      <v-col cols="auto">
        <h2>Login</h2>
      </v-col>
    </v-row>
    <v-form v-model="state.valid" @submit="login()">
      <v-row justify="center">
        <v-col cols="10">
          <v-text-field
            label="Display Name"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="10">
          <v-text-field label="Server Password"></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn type="submit" :flat="true" size="large" color="success" append-icon="fa-solid fa-right-to-bracket">Login</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-main>
</template>

<script setup lang="ts">
import {inject, reactive} from 'vue'
import {SHARED_EVENTS} from '../assets/shared/events'

const state = reactive({
  valid: false,
  username: '',
  password: ''
})

const _systemNotification = inject<Function>(SHARED_EVENTS.SYSTEM_NOTIFICATION)

function login() {
  _systemNotification('error', 'test2')
  //socket.emit(EVENTS.AUTHENTICATE, 'test message')
}
</script>
