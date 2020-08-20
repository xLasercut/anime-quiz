<template>
  <v-row justify="center">
    <table-filter-text
      label="Anime" :value="$store.state.awq.weaponListFilter.anime"
      @input="updateWeaponFilter($event, 'anime')"
      cols="5"
    ></table-filter-text>
    <table-filter-text
      label="Weapon" :value="$store.state.awq.weaponListFilter.weapon"
      @input="updateWeaponFilter($event, 'weapon')"
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
    const updateWeaponFilter = debounce((value: string, key: string): void => {
      let newFilter = context.root.$store.state.awq.weaponListFilter
      newFilter[key] = value
      context.root.$store.commit('UPDATE_AWQ_WEAPON_LIST_FILTER', newFilter)
    }, 100)

    return {updateWeaponFilter}
  }
})
</script>
