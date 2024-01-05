<template>
  <v-row justify="center" :dense="true">
    <v-col cols="12">
      <v-autocomplete v-bind="$attrs" variant="outlined" density="comfortable" :chips="true" :multiple="true">
        <template #chip="{ item }">
          <v-chip color="primary" :label="true" size="small">{{ item.raw.animeName }}</v-chip>
        </template>
      </v-autocomplete>
    </v-col>
  </v-row>
</template>

<script setup lang="ts"></script>
