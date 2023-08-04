<template>
  <v-row justify="center">
    <v-col v-for="card of filteredCards()" :key="card.route" cols="6" md="4">
      <lobby-menu-card
        :icon="card.icon"
        :color="card.color"
        :title="card.title"
        :description="card.description"
        @click="changeView(card.route)"
      ></lobby-menu-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import LobbyMenuCard from '@/components/lobby/LobbyMenuCard.vue';
import { ROUTES } from '@/assets/routing/routes';
import { useClientStore } from '@/plugins/store/client';
import { useAdminStore } from '@/plugins/store/admin';

export default defineComponent({
  components: { LobbyMenuCard },
  setup() {
    const clientStore = useClientStore();
    const adminStore = useAdminStore();

    const state = reactive({
      cards: [
        {
          color: 'primary',
          title: 'Song List',
          description: 'Add/Remove songs from your song list',
          route: ROUTES.SONG_LIST_EDIT,
          requireAdmin: false,
          icon: 'mdi-playlist-music'
        },
        {
          color: 'success',
          title: 'User Settings',
          description: 'Update your user settings',
          route: ROUTES.USER_SETTINGS,
          requireAdmin: false,
          icon: 'mdi-gamepad-variant'
        },
        {
          color: 'error',
          title: 'Anime Edit',
          description: 'Add/Edit/Delete animes',
          route: ROUTES.ANIME_EDIT,
          requireAdmin: true,
          icon: 'mdi-database-edit'
        },
        {
          color: 'error',
          title: 'User Edit',
          description: 'Add/Edit/Delete users',
          route: ROUTES.USER_EDIT,
          requireAdmin: true,
          icon: 'mdi-database-edit'
        }
      ]
    });

    function changeView(route: string) {
      clientStore.changeView(route);
    }

    function filteredCards() {
      return state.cards.filter((card) => {
        if (showCard(card.requireAdmin)) {
          return card;
        }
      });
    }

    function showCard(requireAdmin: boolean): boolean {
      if (!requireAdmin) {
        return true;
      }
      return clientStore.clientData.admin;
    }

    onMounted(() => {
      adminStore.$reset();
    });

    return { changeView, ...toRefs(state), filteredCards };
  }
});
</script>
