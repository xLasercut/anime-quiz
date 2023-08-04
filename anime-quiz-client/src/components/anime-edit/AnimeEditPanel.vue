<template>
  <nav-btn icon="mdi-plus" color="success" @click="newAnime()">New Anime</nav-btn>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import { DIALOG_ROUTES, ROUTES } from '@/assets/routing/routes';
import { injectStrict } from '@/assets/game-helpers';
import { OpenDialog } from '@/assets/types';
import { CLIENT_EVENTS } from '@/assets/events';
import { useAdminStore } from '@/plugins/store/admin';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { useDataStore } from '@/plugins/store/data';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';

export default defineComponent({
  components: { NavBtn },
  setup() {
    const clientStore = useClientStore();
    const adminStore = useAdminStore();
    const dataStore = useDataStore();
    const openDialog = injectStrict<OpenDialog>(CLIENT_EVENTS.OPEN_DIALOG);

    function back() {
      clientStore.changeView(ROUTES.LOBBY);
    }

    function newAnime() {
      adminStore.updateAnimeInEdit({
        animeId: '',
        animeName: []
      });
      adminStore.generateNewAnimeId();
      adminStore.updateEditMode(DATABASE_EDIT_MODE.NEW);
      openDialog(DIALOG_ROUTES.ANIME_EDIT, 'New Anime');
    }

    function reload() {
      dataStore.updateAnimeNames([]);
      dataStore.updateAnimeList([]);
      socket.emit(SOCKET_EVENTS.UPDATE_STORE_ANIME_NAMES);
      socket.emit(SOCKET_EVENTS.UPDATE_STORE_ANIME_LIST);
    }

    return { back, newAnime, reload };
  }
});
</script>
