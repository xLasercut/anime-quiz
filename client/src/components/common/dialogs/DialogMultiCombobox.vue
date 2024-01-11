<template>
  <v-row justify="center" :dense="true">
    <v-col cols="12">
      <v-combobox v-bind="$attrs" variant="outlined" density="compact" :chips="true" :multiple="true">
        <template #chip="{ item }">
          <v-chip :label="true" color="primary">{{ item.raw }}</v-chip>
        </template>
      </v-combobox>
    </v-col>
  </v-row>
</template>

<script setup lang="ts"></script>
