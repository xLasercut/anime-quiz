<template>
  <v-form v-bind="$attrs">
    <v-container :fluid="true">
      <slot></slot>
    </v-container>
  </v-form>
</template>

<script setup lang="ts"></script>
