<template>
  <v-row justify="end">
    <v-col cols="auto">
      <v-btn
        @click="$emit('dialog:close')"
        color="error"
        append-icon="mdi-close"
        flat
      >Cancel</v-btn>
    </v-col>
    <v-col cols="auto">
      <v-btn
        flat
        color="success"
        type="submit"
        append-icon="mdi-check"
      >Confirm</v-btn>
    </v-col>
  </v-row>
</template>
