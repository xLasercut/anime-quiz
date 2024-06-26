<template>
  <v-data-table
    density="compact"
    :fixed-header="true"
    :fixed-footer="true"
    :items="filteredEmojiList"
    :headers="headers"
    v-model:page="currentPage"
    :items-per-page="itemsPerPage"
    :height="CLIENT_CONSTANTS.ADMIN_TABLE_HEIGHT"
    :no-filter="true"
  >
    <template #item.src="{ item }">
      <game-emoji width="25pt" :emoji="item"></game-emoji>
    </template>

    <template #item.action="{ item }">
      <table-action @item:edit="editEmoji(item)" @item:delete="deleteEmoji(item)"></table-action>
    </template>

    <template #top>
      <v-container :fluid="true">
        <emoji-edit-table-filters
          v-model:type.trim="filters.type"
          v-model:emoji-id.trim="filters.emojiId"
          v-model:command="filters.command"
        ></emoji-edit-table-filters>
      </v-container>
    </template>

    <template #bottom="{ pageCount }">
      <table-pagination
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :length="pageCount"
        :local-storage-key="LOCAL_STORAGE_CONSTANTS.EMOJI_EDIT_TABLE_ITEMS_PER_PAGE"
      ></table-pagination>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { TEmoji } from 'anime-quiz-shared-resources';
import { CLIENT_CONSTANTS, DATABASE_EDIT_MODE, LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import GameEmoji from '@/components/common/GameEmoji.vue';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import EmojiEditTableFilters from '@/components/emoji-edit/EmojiEditTableFilters.vue';
import TableAction from '@/components/common/tables/TableAction.vue';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { useAdminStore } from '@/plugins/store/admin';
import { TOpenDialog } from '@/assets/types';
import { CLIENT_EVENTS } from '@/assets/events';
import { usePagination } from '@/assets/pagination-helpers';

const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as TOpenDialog;
const headers = [
  { title: 'Emoji ID', key: 'emojiId', sortable: false },
  { title: 'Command', key: 'command', sortable: false },
  { title: 'Src', key: 'src', sortable: false },
  { title: 'Type', key: 'type', sortable: false },
  { title: 'Action', key: 'action', sortable: false, width: CLIENT_CONSTANTS.TABLE_ACTION_WIDTH }
];
const { currentPage, itemsPerPage } = usePagination(LOCAL_STORAGE_CONSTANTS.EMOJI_EDIT_TABLE_ITEMS_PER_PAGE);
const filters = ref({
  emojiId: '',
  command: '',
  type: ['img', 'dec']
});

function editEmoji(emoji: TEmoji) {
  adminStore.updateEmojiInEdit(emoji);
  adminStore.updateEditMode(DATABASE_EDIT_MODE.EDIT);
  openDialog(DIALOG_ROUTES.EMOJI_EDIT, 'Edit Emoji');
}

function deleteEmoji(emoji: TEmoji) {
  adminStore.updateEmojiInEdit(emoji);
  adminStore.updateEditMode(DATABASE_EDIT_MODE.DELETE);
  openDialog(DIALOG_ROUTES.EMOJI_EDIT, 'Delete Emoji');
}

const filteredEmojiList = computed((): TEmoji[] => {
  return dataStore.emojiList.filter((emoji) => {
    return (
      emoji.emojiId.includes(filters.value.emojiId) &&
      emoji.command.toLowerCase().includes(filters.value.command.toLowerCase()) &&
      filters.value.type.includes(emoji.type)
    );
  });
});
</script>
