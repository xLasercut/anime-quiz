<template>
  <v-pagination
    :model-value="$store.state.songList.currentPage"
    @update:modelValue="updateCurrentPage"
    :length="$store.getters.maxPage"
    :total-visible="7"
  ></v-pagination>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { MUTATIONS } from '../../../plugins/store/mutations'
import { store } from '../../../plugins/store'

export default defineComponent({
  setup() {
    function updateCurrentPage(currentPage: number): void {
      store.commit(MUTATIONS.UPDATE_SONG_LIST_CURRENT_PAGE, currentPage)
    }

    return {
      updateCurrentPage
    }
  }
})
</script>
