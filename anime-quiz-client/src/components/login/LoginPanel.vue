<template>
  <nav-btn append-icon="mdi-cog" color="primary">Settings</nav-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBtn from "@/components/common/buttons/NavBtn.vue";

export default defineComponent({
  components: {NavBtn}
});
</script>
