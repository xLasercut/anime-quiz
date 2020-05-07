<template>
  <v-toolbar-items>
    <nav-btn
      color="success" icon="mdi-download"
      v-if="$store.state.list.currentUser"
      :download="filename" :href="downloadHref"
    ></nav-btn>
    <nav-btn color="warning" icon="mdi-sync" @click="reloadSongList()"></nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
  import {computed, defineComponent} from '@vue/composition-api'
  import NavBtn from '@/components/buttons/NavBtn.vue'
  import {ISong} from '../../../shared/interfaces/database'
  import {socket} from '@/assets/socket'

  export default defineComponent({
    components: {
      NavBtn
    },
    setup(_props, context) {
      const filename = computed(() => {
        return `${context.root.$store.state.list.currentUser}.json`
      })

      const downloadHref = computed(() => {
        let userList = context.root.$store.state.list.songList.filter((song: ISong): ISong | undefined => {
          if (context.root.$store.state.list.userSongs.has(song.songId)) {
            return song
          }
        })
        let blob = new Blob([JSON.stringify(userList, null, 2)], {type: 'text/plain'})
        return window.URL.createObjectURL(blob)
      })

      function reloadSongList(): void {
        context.root.$store.commit('SOCKET_UPDATE_SONG_LIST', [])
        socket.emit('GET_SONG_LIST')
      }

      return {filename, downloadHref, reloadSongList}
    }
  })
</script>
