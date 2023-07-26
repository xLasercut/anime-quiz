<template>
  <v-main>
    <v-card variant="flat">
      <v-card-title>
        <v-row justify="center">
          <v-col cols="auto">
            <h2>User Settings</h2>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-container :fluid="true">
          <v-row justify="center" no-gutters>
            <v-col cols="auto">
              test
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IconBtn from '@/components/common/buttons/IconBtn.vue';

export default defineComponent({
  components: { IconBtn }
});
</script>
