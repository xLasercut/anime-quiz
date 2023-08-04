<template>
  <v-row :dense="true">
    <v-col cols="auto">
      <table-action-btn icon="mdi-pencil" color="warning" @click="$emit('item:edit')"></table-action-btn>
    </v-col>
    <v-col cols="auto">
      <table-action-btn icon="mdi-delete" color="error" @click="$emit('item:delete')"></table-action-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TableActionBtn from '@/components/common/buttons/TableActionBtn.vue';

export default defineComponent({
  components: { TableActionBtn }
});
</script>
