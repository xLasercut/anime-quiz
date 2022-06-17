<template>
  <div class="v-data-footer">
    <div class="v-data-footer__pagination">
      <v-pagination
        :style="footerStyle()"
        :value="currentPage"
        @input="$emit('input', $event)"
        :length="length"
      ></v-pagination>
    </div>
    <div class="v-data-footer__select">
      Rows per page:
      <v-select
        :value="itemsPerPage"
        @input="$emit('update:items-per-page', $event)"
        hide-details
        dense
        outlined
        :items="paginationSelectItems"
      ></v-select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';

export default defineComponent({
  props: {
    itemsPerPage: {
      required: true
    },
    length: {
      required: true,
      type: Number
    },
    currentPage: {
      required: true,
      type: Number
    },
    width: {
      type: String,
      default: (): string => {
        return '550px';
      }
    }
  },
  setup(props) {
    const state = reactive({
      paginationSelectItems: [5, 10, 15, 20]
    });

    function footerStyle() {
      return {
        width: props.width
      };
    }

    return {
      ...toRefs(state),
      footerStyle
    };
  }
});
</script>
