<template>
  <v-data-table
    density="compact"
    :fixed-header="true"
    :fixed-footer="true"
    :headers="headers"
    :items="filteredMessageList"
    v-model:page="currentPage"
    :items-per-page="itemsPerPage"
    :height="CLIENT_CONSTANTS.ADMIN_TABLE_HEIGHT"
    :no-filter="true"
  >
    <template #item.avatar="{ item }">
      <game-avatar :avatar="item.avatar"></game-avatar>
    </template>

    <template #item.action="{ item }">
      <table-action @item:edit="editBotMessage(item)" @item:delete="deleteBotMessage(item)"></table-action>
    </template>

    <template #top>
      <v-container :fluid="true">
        <bot-message-edit-table-filters
          v-model:message-id.trim="filters.messageId"
          v-model:user-id.trim="filters.userId"
          v-model:command="filters.command"
        ></bot-message-edit-table-filters>
      </v-container>
    </template>

    <template #bottom="{ pageCount }">
      <table-pagination
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :length="pageCount"
        :local-storage-key="LOCAL_STORAGE_CONSTANTS.BOT_MESSAGE_EDIT_TABLE_ITEMS_PER_PAGE"
      ></table-pagination>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { TBotMessage } from 'anime-quiz-shared-resources/src/models/types';
import { useDataStore } from '@/plugins/store/data';
import { CLIENT_CONSTANTS, DATABASE_EDIT_MODE, LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import { computed, inject, ref } from 'vue';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import GameAvatar from '@/components/common/GameAvatar.vue';
import TableAction from '@/components/common/tables/TableAction.vue';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { useAdminStore } from '@/plugins/store/admin';
import { CLIENT_EVENTS } from '@/assets/events';
import { TOpenDialog } from '@/assets/types';
import BotMessageEditTableFilters from '@/components/bot-message-edit/BotMessageEditTableFilters.vue';
import { usePagination } from '@/assets/pagination-helpers';

const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as TOpenDialog;

const headers = [
  { title: 'Message ID', key: 'messageId', sortable: false },
  { title: 'User ID', key: 'userId', sortable: false },
  { title: 'Command', key: 'command', sortable: false },
  { title: 'Display Name', key: 'displayName', sortable: false },
  { title: 'Avatar', key: 'avatar', sortable: false },
  { title: 'Text', key: 'text', sortable: false },
  { title: 'Action', key: 'action', sortable: false, width: CLIENT_CONSTANTS.TABLE_ACTION_WIDTH }
];

const { currentPage, itemsPerPage } = usePagination(LOCAL_STORAGE_CONSTANTS.BOT_MESSAGE_EDIT_TABLE_ITEMS_PER_PAGE);
const filters = ref({
  messageId: '',
  userId: '',
  command: ''
});

function editBotMessage(botMessage: TBotMessage) {
  adminStore.updateBotMessageInEdit(botMessage);
  adminStore.updateEditMode(DATABASE_EDIT_MODE.EDIT);
  openDialog(DIALOG_ROUTES.BOT_MESSAGE_EDIT, 'Edit Bot Message');
}

function deleteBotMessage(botMessage: TBotMessage) {
  adminStore.updateBotMessageInEdit(botMessage);
  adminStore.updateEditMode(DATABASE_EDIT_MODE.DELETE);
  openDialog(DIALOG_ROUTES.BOT_MESSAGE_EDIT, 'Delete Bot Message');
}

const filteredMessageList = computed((): TBotMessage[] => {
  return dataStore.botMessageList.filter((botMessage) => {
    return (
      botMessage.messageId.includes(filters.value.messageId) &&
      botMessage.command.toLowerCase().includes(filters.value.command.toLowerCase()) &&
      botMessage.userId.includes(filters.value.userId)
    );
  });
});
</script>
