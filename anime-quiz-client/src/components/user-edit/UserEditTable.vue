<template>
  <v-data-table
    density="compact"
    :fixed-header="true"
    :fixed-footer="true"
    :items="filteredUserList()"
    :headers="headers"
    v-model:page="currentPage"
    :items-per-page="itemsPerPage"
    :height="CLIENT_CONSTANTS.ADMIN_TABLE_HEIGHT"
  >
    <template #item.avatar="{ item }">
      <game-avatar :avatar="item.raw.avatar"></game-avatar>
    </template>

    <template #item.admin="{ item }">
      {{ item.raw.admin }}
    </template>

    <template #item.action="{ item }">
      <v-row :dense="true">
        <v-col cols="auto">
          <table-action-btn icon="mdi-pencil" color="warning" @click="editUser(item.raw)"></table-action-btn>
        </v-col>
        <v-col cols="auto">
          <table-action-btn icon="mdi-delete" color="error" @click="deleteUser(item.raw)"></table-action-btn>
        </v-col>
      </v-row>
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

    <template #bottom="{ pageCount }">
      <table-pagination v-model:current-page="currentPage" v-model:items-per-page="itemsPerPage" :length="pageCount"></table-pagination>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { UserType } from '@/assets/shared/models/types';
import GameAvatar from '@/components/common/GameAvatar.vue';
import UserEditTableFilters from '@/components/user-edit/UserEditTableFilters.vue';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import TableActionBtn from '@/components/common/buttons/TableActionBtn.vue';
import { injectStrict } from '@/assets/game-helpers';
import { OpenDialog } from '@/assets/types';
import { CLIENT_EVENTS } from '@/assets/events';
import { CLIENT_CONSTANTS, DATABASE_EDIT_MODE } from '@/assets/constants';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { useAdminStore } from '@/plugins/store/admin';

export default defineComponent({
  components: { TableActionBtn, IconBtn, TablePagination, UserEditTableFilters, GameAvatar },
  setup() {
    const dataStore = useDataStore();
    const adminStore = useAdminStore();
    const openDialog = injectStrict<OpenDialog>(CLIENT_EVENTS.OPEN_DIALOG);
    const state = reactive({
      headers: [
        { title: 'Discord ID', key: 'discordId', sortable: false },
        { title: 'User ID', key: 'userId', sortable: false },
        { title: 'Display Name', key: 'displayName', sortable: false },
        { title: 'Avatar', key: 'avatar', sortable: false },
        { title: 'Admin', key: 'admin', sortable: false },
        { title: 'Action', key: 'action', sortable: false }
      ],
      filters: {
        discordId: '',
        userId: '',
        displayName: ''
      },
      currentPage: 1,
      itemsPerPage: 15
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

    function editUser(user: UserType) {
      adminStore.updateUserInEdit(user);
      adminStore.updateEditMode(DATABASE_EDIT_MODE.EDIT);
      openDialog(DIALOG_ROUTES.USER_EDIT, 'Edit User');
    }

    function deleteUser(user: UserType) {
      adminStore.updateUserInEdit(user);
      adminStore.updateEditMode(DATABASE_EDIT_MODE.DELETE);
      openDialog(DIALOG_ROUTES.USER_EDIT, 'Delete User');
    }

    return { dataStore, filteredUserList, ...toRefs(state), editUser, deleteUser, CLIENT_CONSTANTS };
  }
});
</script>
