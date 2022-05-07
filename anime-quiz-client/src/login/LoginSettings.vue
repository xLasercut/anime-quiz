<template>
  <v-form>
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-text-field></v-text-field>
        </v-row>
        <dialog-actions @dialog:close="$emit('dialog:close')"></dialog-actions>
      </v-container>
    </v-card-text>
  </v-form>
</template>

<script setup lang="ts">
import DialogActions from '../components/dialog/DialogActions.vue'


</script>
