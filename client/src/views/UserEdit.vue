<template>
  <v-main>
    <v-card flat>
      <user-edit-table></user-edit-table>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { socket } from '../plugins/socket'
import { SHARED_EVENTS } from 'anime-quiz-server/src/shared/events'
import UserEditTable from '../components/user-edit/UserEditTable.vue'

export default defineComponent({
  components: { UserEditTable },
  setup() {
    socket.emit(SHARED_EVENTS.JOIN_USER_EDIT)
  }
})
</script>
