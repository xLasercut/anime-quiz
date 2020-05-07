<template>
  <v-container fluid>
    <nav-panel show-home>
      <list-picker-controls></list-picker-controls>
    </nav-panel>
    <v-content>
      <v-card flat>
        <v-container fluid>
          <song-list-table></song-list-table>
        </v-container>
      </v-card>
    </v-content>
  </v-container>
</template>

<script lang="ts">
  import {defineComponent, onMounted} from '@vue/composition-api'
  import NavPanel from '@/components/NavPanel.vue'
  import ListPickerControls from '@/list-picker/ListPickerControls.vue'
  import {socket} from '@/assets/socket'
  import SongListTable from '@/list-picker/SongListTable.vue'

  export default defineComponent({
    components: {
      NavPanel, ListPickerControls, SongListTable
    },
    setup(_props, context) {
      onMounted(() => {
        if (socket.disconnected) {
          context.root.$router.push('/login')
        }
      })
    }
  })
</script>
