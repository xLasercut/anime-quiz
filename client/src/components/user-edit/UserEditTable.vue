<template>
  <v-data-table
    density="compact"
    :fixed-header="true"
    :fixed-footer="true"
    :items="filteredUserList"
    :headers="headers"
    v-model:page="currentPage"
    :items-per-page="itemsPerPage"
    :height="CLIENT_CONSTANTS.ADMIN_TABLE_HEIGHT"
    :no-filter="true"
  >
    <template #item.avatar="{ item }">
      <game-avatar :avatar="item.avatar"></game-avatar>
    </template>

    <template #item.admin="{ item }">
      {{ item.admin }}
    </template>

    <template #item.action="{ item }">
      <table-action @item:edit="editUser(item)" @item:delete="deleteUser(item)"></table-action>
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
      <table-pagination
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :length="pageCount"
        :local-storage-key="LOCAL_STORAGE_CONSTANTS.USER_EDIT_TABLE_ITEMS_PER_PAGE"
      ></table-pagination>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { TUser } from 'anime-quiz-shared-resources/src/models/types';
import GameAvatar from '@/components/common/GameAvatar.vue';
import UserEditTableFilters from '@/components/user-edit/UserEditTableFilters.vue';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import { TOpenDialog } from '@/assets/types';
import { CLIENT_EVENTS } from '@/assets/events';
import { CLIENT_CONSTANTS, DATABASE_EDIT_MODE, LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { useAdminStore } from '@/plugins/store/admin';
import TableAction from '@/components/common/tables/TableAction.vue';
import { usePagination } from '@/assets/pagination-helpers';

const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as TOpenDialog;
const headers = [
  { title: 'Discord ID', key: 'discordId', sortable: false },
  { title: 'User ID', key: 'userId', sortable: false },
  { title: 'Display Name', key: 'displayName', sortable: false },
  { title: 'Avatar', key: 'avatar', sortable: false },
  { title: 'Admin', key: 'admin', sortable: false },
  { title: 'Action', key: 'action', sortable: false, width: CLIENT_CONSTANTS.TABLE_ACTION_WIDTH }
];
const filters = ref({
  discordId: '',
  userId: '',
  displayName: ''
});
const { currentPage, itemsPerPage } = usePagination(LOCAL_STORAGE_CONSTANTS.USER_EDIT_TABLE_ITEMS_PER_PAGE);

const filteredUserList = computed((): TUser[] => {
  return dataStore.userList.filter((user) => {
    return (
      user.discordId.includes(filters.value.discordId) &&
      user.userId.includes(filters.value.userId) &&
      user.displayName.toLowerCase().includes(filters.value.displayName.toLowerCase())
    );
  });
});

function editUser(user: TUser) {
  adminStore.updateUserInEdit(user);
  adminStore.updateEditMode(DATABASE_EDIT_MODE.EDIT);
  openDialog(DIALOG_ROUTES.USER_EDIT, 'Edit User');
}

function deleteUser(user: TUser) {
  adminStore.updateUserInEdit(user);
  adminStore.updateEditMode(DATABASE_EDIT_MODE.DELETE);
  openDialog(DIALOG_ROUTES.USER_EDIT, 'Delete User');
}
</script>
