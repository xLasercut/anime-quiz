<template>
  <v-row justify="center">
    <table-filter-text
      label="Anime" :value="$store.state.aiq.imageListFilter.anime"
      @input="updateFilter($event, 'anime')"
      cols="5"
    ></table-filter-text>
    <table-filter-text
      label="Name" :value="$store.state.aiq.imageListFilter.name"
      @input="updateFilter($event, 'name')"
      cols="5"
    ></table-filter-text>
  </v-row>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import TableFilterText from '@/components/table/TableFilterText.vue'
import {debounce} from '@/assets/debounce'

export default defineComponent({
  components: {
    TableFilterText
  },
  setup(_props, context) {
    const updateFilter = debounce((value: string, key: string): void => {
      let newFilter = context.root.$store.state.aiq.imageListFilter
      newFilter[key] = value
      context.root.$store.commit('UPDATE_AIQ_IMAGE_LIST_FILTER', newFilter)
    }, 100)

    return {updateFilter}
  }
})
</script>
