<template>
  <v-toolbar-items>
    <nav-btn
      color="success" icon="mdi-download"
      v-if="$store.state.amq.currentUser"
      :download="filename" :href="downloadHref"
    ></nav-btn>
    <nav-btn color="warning" icon="mdi-sync" @click="reloadSongList()"></nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import {computed, defineComponent} from '@vue/composition-api'
import NavBtn from '@/components/buttons/NavBtn.vue'
import {IAmqSong} from '../../../shared/interfaces/database'
import {socket} from '@/assets/socket'

export default defineComponent({
  components: {
    NavBtn
  },
  setup(_props, context) {
    const filename = computed(() => {
      return `${context.root.$store.state.amq.currentUser}.json`
    })

    const downloadHref = computed(() => {
      let userList = context.root.$store.state.amq.songList.filter((song: IAmqSong): IAmqSong | undefined => {
        if (context.root.$store.state.amq.userSongs.has(song.songId)) {
          return song
        }
      })
      let blob = new Blob([JSON.stringify(userList, null, 2)], {type: 'text/plain'})
      return window.URL.createObjectURL(blob)
    })

    function reloadSongList(): void {
      context.root.$store.commit('SOCKET_UPDATE_AMQ_SONG_LIST', [])
      socket.emit('GET_AMQ_SONG_LIST')
    }

    return {filename, downloadHref, reloadSongList}
  }
})
</script>
