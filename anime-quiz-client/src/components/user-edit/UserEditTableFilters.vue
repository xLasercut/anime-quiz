<template>
  <v-row :dense="true">
    <v-col>
      <table-filter-text-field
        label="Discord ID"
        :model-value="discordId"
        @update:model-value="updateDiscordId($event)"
      ></table-filter-text-field>
    </v-col>
    <v-col>
      <table-filter-text-field
        label="User ID"
        :model-value="userId"
        @update:model-value="updateUserId($event)"
      ></table-filter-text-field>
    </v-col>
    <v-col>
      <table-filter-text-field
        label="Display Name"
        :model-value="displayName"
        @update:model-value="updateDisplayName($event)"
      ></table-filter-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TableFilterTextField from '@/components/common/tables/TableFilterTextField.vue';
import { debounce } from '@/assets/game-helpers';

export default defineComponent({
  props: {
    discordId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      required: true
    }
  },
  components: { TableFilterTextField },
  setup(_props, context) {
    const updateDiscordId = debounce((val: string) => {
      context.emit('update:discord-id', val);
    }, 100);

    const updateUserId = debounce((val: string) => {
      context.emit('update:user-id', val);
    }, 100);

    const updateDisplayName = debounce((val: string) => {
      context.emit('update:display-name', val);
    });

    return { updateDiscordId, updateUserId, updateDisplayName };
  }
});
</script>
