<template>
  <v-pagination
    :model-value="$store.state.songList.currentPage"
    @update:modelValue="updateCurrentPage"
    :length="$store.getters.maxPage"
    :total-visible="7"
  ></v-pagination>
</template>

<script setup lang="ts">
  import {useStore} from 'vuex'
  import {MUTATIONS} from '../../plugins/store/mutations'

  const store = useStore()

  function updateCurrentPage(currentPage: number): void {
    store.commit(MUTATIONS.UPDATE_SONG_LIST_CURRENT_PAGE, currentPage)
  }
</script>
