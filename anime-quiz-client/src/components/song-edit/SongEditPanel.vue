<template>
  <nav-btn icon="mdi-plus" color="success" @click="newSong()">New Song</nav-btn>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
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

    function newSong() {}

    function reload() {}

    function back() {
      clientStore.changeView(ROUTES.LOBBY);
    }

    return { newSong, reload, back };
  }
});
</script>
