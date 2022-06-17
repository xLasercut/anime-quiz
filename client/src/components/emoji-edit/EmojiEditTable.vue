<template>
  <v-data-table
    dense
    disable-sort
    fixed-header
    disable-filtering
    hide-default-footer
    :height="CLIENT_CONSTANTS.TABLE_HEIGHT"
    :headers="headers"
    :items="filteredEmojiList()"
    :items-per-page="itemsPerPage"
    :page="currentPage"
  >
    <template #top>
      <v-container fluid>
        <emoji-edit-table-filter
          :emoji-command-filter.sync="emojiCommandFilter"
          :emoji-source-filter.sync="emojiSourceFilter"
          :emoji-type-filter.sync="emojiTypeFilter"
        ></emoji-edit-table-filter>
      </v-container>
    </template>

    <template #item.src="{ item }">
      <emoji-preview :emoji="item"></emoji-preview>
    </template>

    <template #item.action="{ item }">
      <v-icon color="warning" @click="editEmoji(item)">mdi-pencil</v-icon>
      <v-icon color="error" @click="deleteEmoji(item)">mdi-delete</v-icon>
    </template>

    <template #footer="{ props }">
      <table-pagination
        :current-page="props.pagination.page"
        @input="currentPage = $event"
        :length="props.pagination.pageCount"
        :items-per-page.sync="itemsPerPage"
      ></table-pagination>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, toRefs } from '@vue/composition-api';
import TablePagination from '../shared/TablePagination.vue';
import { CLIENT_CONSTANTS } from '../../assets/constants';
import { AqEmoji } from '../../assets/shared/interfaces';
import { store } from '../../plugins/store';
import { MUTATIONS } from '../../plugins/store/mutations';
import { CLIENT_EVENTS } from '../../assets/events';
import { DIALOG_ROUTES } from '../../plugins/routing/routes';
import EmojiEditTableFilter from './EmojiEditTableFilter.vue';
import EmojiPreview from './EmojiPreview.vue';

export default defineComponent({
  components: { EmojiPreview, EmojiEditTableFilter, TablePagination },
  setup() {
    const state = reactive({
      headers: [
        { text: 'Emoji ID', value: 'emoji_id' },
        { text: 'Command', value: 'command' },
        { text: 'Source', value: 'src' },
        { text: 'Type', value: 'type' },
        { text: 'Action', value: 'action' }
      ],
      itemsPerPage: 10,
      currentPage: 0,
      emojiCommandFilter: '',
      emojiTypeFilter: '',
      emojiSourceFilter: ''
    });

    const openDialog = inject<Function>(CLIENT_EVENTS.OPEN_DIALOG);

    function filteredEmojiList(): AqEmoji[] {
      return store.getters.emojiList.filter((emoji: AqEmoji) => {
        return (
          emoji.command.toLowerCase().includes(state.emojiCommandFilter.toLowerCase()) &&
          emoji.src.toLowerCase().includes(state.emojiSourceFilter.toLowerCase()) &&
          emoji.type.toLowerCase().includes(state.emojiTypeFilter.toLowerCase())
        );
      });
    }

    function updateStore(emoji: AqEmoji): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_EMOJI_TYPE, emoji.type);
      store.commit(MUTATIONS.ADMIN_UPDATE_EMOJI_COMMAND, emoji.command);
      store.commit(MUTATIONS.ADMIN_UPDATE_EMOJI_SRC, emoji.src);
      store.commit(MUTATIONS.ADMIN_UPDATE_EMOJI_ID, emoji.emoji_id);
    }

    function editEmoji(emoji: AqEmoji): void {
      if (openDialog) {
        updateStore(emoji);
        openDialog(DIALOG_ROUTES.EDIT_EMOJI_DIALOG, 'Edit Emoji');
      }
    }

    function deleteEmoji(emoji: AqEmoji): void {
      if (openDialog) {
        updateStore(emoji);
        openDialog(DIALOG_ROUTES.DELETE_EMOJI_DIALOG, 'Delete Emoji');
      }
    }

    return {
      ...toRefs(state),
      CLIENT_CONSTANTS,
      filteredEmojiList,
      editEmoji,
      deleteEmoji
    };
  }
});
</script>
