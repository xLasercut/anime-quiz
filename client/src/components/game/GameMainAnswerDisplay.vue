<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-row no-gutters justify="center">
        <v-col cols="5" sm="3" md="2">
          <v-sheet class="count-container">
            {{ currentCount }} / {{ maxCount }}
          </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters justify="center">
        <v-col cols="12" sm="8" md="6" lg="5">
          <v-sheet class="answer-container">
            {{ displayedAnswer }}
          </v-sheet>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {computed, defineComponent} from '@vue/composition-api'

export default defineComponent({
  props: {
    currentCount: {
      required: true
    },
    maxCount: {
      required: true
    },
    answer: {
      required: true
    },
    show: {
      required: true,
      default: false
    }
  },
  setup(props, _context) {
    const displayedAnswer = computed(() => {
      if (props.show) {
        return props.answer
      }
      return '?'
    })

    return {displayedAnswer}
  }
})
</script>


<style scoped>
.count-container {
  border-radius: 20px 20px 0 0;
  text-align: center;
}

.answer-container {
  font-size: 16pt;
  text-align: center;
  border-radius: 5px;
}
</style>
