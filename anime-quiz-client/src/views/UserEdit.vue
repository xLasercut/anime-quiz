<template>
  <v-card variant="flat">
    <user-edit-table></user-edit-table>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import UserEditTable from '@/components/user-edit/UserEditTable.vue';

export default defineComponent({
  components: { UserEditTable },
  setup() {
    socket.emit(SOCKET_EVENTS.UPDATE_STORE_USER_LIST);
  }
});
</script>
