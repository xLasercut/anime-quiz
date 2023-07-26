<template>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import { ROUTES } from '@/assets/routing/routes';

export default defineComponent({
  components: { NavBtn },
  setup() {
    const clientStore = useClientStore();

    function back() {
      clientStore.changeView(ROUTES.LOBBY);
    }

    return { back };
  }
});
</script>
