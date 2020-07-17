<template>
  <song-list-table>
    <template #action="{item}">
      <table-btn icon="mdi-playlist-check" color="success" @click="selectSong(item)"></table-btn>
    </template>
  </song-list-table>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import SongListTable from '@/list-picker/SongListTable.vue'
  import TableBtn from '@/components/buttons/TableBtn.vue'
  import {ISong} from '../../../../../shared/interfaces/database'
  import {socket} from '@/assets/socket'

  export default defineComponent({
    components: {
      SongListTable, TableBtn
    },
    setup(_props, context) {
      function selectSong(song: ISong): void {
        socket.emit('AMQ_SONG_OVERRIDE', song)
        context.emit('dialog:close')
      }

      return {selectSong}
    }
  })
</script>
