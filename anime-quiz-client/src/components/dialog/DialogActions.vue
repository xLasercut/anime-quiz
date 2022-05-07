<template>
  <v-row justify="end">
    <v-col cols="auto">
      <v-btn :flat="true" @click="$emit('dialog:close')" color="error">Cancel</v-btn>
    </v-col>
    <v-col cols="auto">
      <v-btn :flat="true" color="success" type="submit">Confirm</v-btn>
    </v-col>
  </v-row>
</template>
