<template>
  <v-card-text>
    <v-row>
      <v-col>
        <v-slider
          :min="0"
          :max="maxTime"
          thumb-label
          @change="$emit('seek', $event)"
          hide-details
          :value="currentDisplayTime"
          @mousedown="seeking = true"
          @mouseup="seeking = false"
          :thumb-size="40"
          :disabled="disabled"
        >
          <template v-slot:thumb-label="{ value }">
            {{ getTimestamp(value) }}
          </template>
        </v-slider>
      </v-col>
      <v-col cols="auto">
        <span class="music-control-time">{{ getTimestamp(currentTime) }} / {{ getTimestamp(maxTime) }}</span>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto" align-self="center">
        <fab-btn icon="mdi-skip-previous" :disabled="disabled" color="primary" @click="$emit('previous')"></fab-btn>
      </v-col>
      <v-col cols="auto" v-if="!playing">
        <fab-btn icon="mdi-play" :disabled="disabled" large color="success" @click="$emit('play')"></fab-btn>
      </v-col>
      <v-col cols="auto" v-if="playing">
        <fab-btn icon="mdi-pause" :disabled="disabled" large color="warning" @click="$emit('pause')"></fab-btn>
      </v-col>
      <v-col cols="auto" align-self="center">
        <fab-btn icon="mdi-skip-next" :disabled="disabled" color="primary" @click="$emit('next')"></fab-btn>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import FabBtn from '../shared/buttons/FabBtn.vue'

export default defineComponent({
  components: { FabBtn },
  props: {
    currentTime: {
      required: true,
      type: Number
    },
    maxTime: {
      required: true,
      type: Number
    },
    playing: {
      required: true,
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: (): boolean => {
        return false
      }
    }
  },
  setup(props) {
    const state = reactive({
      seeking: false,
      currentDisplayTime: props.currentTime
    })

    watch(() => props.currentTime, (time: number) => {
      if (!state.seeking) {
        state.currentDisplayTime = time
      }
    })

    function getTimestamp(time: number): string {
      if (time < 3600) {
        return new Date(time * 1000).toISOString().substring(14, 19)
      }
      return new Date(time * 1000).toISOString().substring(11, 16)
    }

    return {
      getTimestamp,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>
.music-control-time {
  line-height: 30px;
  font-size: 11pt;
}
</style>
