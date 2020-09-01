<template>
  <v-row justify="center" dense>
    <v-col cols="12">
      <v-data-table
        disable-pagination disable-filtering disable-sort dense
        hide-default-footer
        :headers="headers"
        :items="displayData($store.getters.filteredAiqImageList)"
      >
        <template #top>
          <aiq-image-list-table-filter></aiq-image-list-table-filter>
        </template>

        <template #item.anime="{item}">
          {{ item.anime[0] }}
        </template>

        <template #item.src="{item}">
          <table-btn icon="mdi-magnify-plus-outline" color="primary" @click="showPreview(item.src)"></table-btn>
        </template>

        <template #item.action="{item}">
          <table-btn
            icon="mdi-pencil"
            color="warning"
            @click="$emit('image:edit', item)"
          ></table-btn>
          <table-btn
            icon="mdi-delete"
            color="error"
            @click="$emit('image:delete', item)"
          ></table-btn>
        </template>

        <template #footer>
          <pagination
            v-model="currentPage"
            :max-page="maxPage"
            :items="items"
            :items-per-page="itemsPerPage"
          ></pagination>
        </template>
      </v-data-table>
      <v-overlay v-model="show" @click.native="show = false">
        <v-img :src="imgSrc" width="500px"></v-img>
      </v-overlay>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import Pagination from '@/components/Pagination.vue'
import TableBtn from '@/components/buttons/TableBtn.vue'
import paginationApi from '@/assets/pagination'
import AiqImageListTableFilter from '@/aiq-image/AiqImageListTableFilter.vue'

export default defineComponent({
  components: {
    Pagination, TableBtn, AiqImageListTableFilter
  },
  setup(_props, context) {
    const state = reactive({
      headers: [
        {text: 'Anime', value: 'anime', sortable: false},
        {text: 'Name', value: 'name', sortable: false},
        {text: 'Image', value: 'src', sortable: false, width: 200},
        {text: 'Action', value: 'action', sortable: false, width: 200}
      ],
      show: false,
      imgSrc: ''
    })

    const {paginationState, displayData} = paginationApi()

    function showPreview(src: string): void {
      state.imgSrc = src
      state.show = true
    }

    return {...toRefs(state), ...toRefs(paginationState), displayData, showPreview}
  }
})
</script>
