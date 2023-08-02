<template>
  <v-data-table
    density="compact"
    :fixed-header="true"
    :fixed-footer="true"
    :items="filteredUserList()"
    :headers="headers"
  >
    <template #item.avatar="{ item }">
      <game-avatar :avatar="item.raw.avatar"></game-avatar>
    </template>

    <template #item.admin="{ item }">
      {{ item.raw.admin }}
    </template>

    <template #top>
      <v-container :fluid="true">
        <user-edit-table-filters
          v-model:discord-id.trim="filters.discordId"
          v-model:user-id.trim="filters.userId"
          v-model:display-name.trim="filters.displayName"
        ></user-edit-table-filters>
      </v-container>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { UserType } from '@/assets/shared/models/types';
import GameAvatar from '@/components/common/GameAvatar.vue';
import UserEditTableFilters from '@/components/user-edit/UserEditTableFilters.vue';

export default defineComponent({
  components: { UserEditTableFilters, GameAvatar },
  setup() {
    const dataStore = useDataStore();
    const state = reactive({
      headers: [
        { title: 'Discord ID', key: 'discordId', sortable: false },
        { title: 'User ID', key: 'userId', sortable: false },
        { title: 'Display Name', key: 'displayName', sortable: false },
        { title: 'Avatar', key: 'avatar', sortable: false },
        { title: 'Admin', key: 'admin', sortable: false },
        { title: 'Action', key: '', sortable: false }
      ],
      filters: {
        discordId: '',
        userId: '',
        displayName: ''
      }
    });

    function filteredUserList(): UserType[] {
      return dataStore.userList.filter((user) => {
        return (
          user.discordId.includes(state.filters.discordId) &&
          user.userId.includes(state.filters.userId) &&
          user.displayName.toLowerCase().includes(state.filters.displayName.toLowerCase())
        );
      });
    }

    return { dataStore, filteredUserList, ...toRefs(state) };
  }
});
</script>
