<template>
  <amq-song-list-table>
    <template #action="{item}">
      <table-btn icon="mdi-playlist-check" color="success" @click="selectSong(item)"></table-btn>
    </template>
  </amq-song-list-table>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import AmqSongListTable from '@/amq-song/AmqSongListTable.vue'
import TableBtn from '@/components/buttons/TableBtn.vue'
import {IAmqSong} from '../../../shared/interfaces/database'
import {socket} from '@/assets/socket'

export default defineComponent({
  components: {
    AmqSongListTable, TableBtn
  },
  setup(_props, context) {
    function selectSong(song: IAmqSong): void {
      socket.emit('AMQ_SONG_OVERRIDE', song)
      context.emit('dialog:close')
    }

    return {selectSong}
  }
})
</script>
