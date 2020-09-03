<template>
  <v-col cols="12">
    <canvas id="aiq-img-small" :width="canvasWidth" :height="canvasHeight" :class="classes()"></canvas>
    <img ref="img" :src="src" @load="imageLoaded()" v-show="showImage"/>
  </v-col>
</template>

<script lang="ts">
import {defineComponent, onMounted, onUnmounted, reactive, ref, toRefs, watch} from '@vue/composition-api'
import {socket} from '@/assets/socket'
import {countdownApi} from '@/assets/countdown'


export default defineComponent({
  setup(_props, context) {
    const state = reactive({
      factor: 1,
      show: false,
      canvasHeight: 200,
      canvasWidth: 300,
      src: '',
      showImage: false
    })

    let c: any = null
    let ctx: any = null
    const img: any = ref(null)

    const {startCountdown, stopCountdown} = countdownApi()

    function classes(): string {
      let classes = ['']

      if (!state.show) {
        classes.push('canvas-hidden')
      }

      return classes.join(' ')
    }

    function changeFactor(): void {
      state.factor -= context.root.$store.getters.factorDecreaseRate
      redrawImage()
    }

    socket.on('AIQ_START_LOAD', (): void => {
      state.showImage = false
      state.show = false
      state.src = context.root.$store.state.aiq.gameState.currentImage.src
    })

    socket.on('AIQ_START_COUNTDOWN', (): void => {
      startCountdown(context.root.$store.state.aiq.settings.guessTime, changeFactor)
      state.showImage = false
      state.show = true
    })

    socket.on('AIQ_TIME_UP', (): void => {
      stopCountdown()
      state.showImage = true
      state.show = false
    })

    socket.on('AIQ_RESET', (): void => {
      stopCountdown()
      state.showImage = true
      state.show = false
    })

    function redrawImage() {
      let fw = (img.value.width / state.factor) | 0
      let fh = (img.value.height / state.factor) | 0
      ctx.drawImage(img.value, 0, 0, fw, fh)
      ctx.drawImage(c, 0, 0, fw, fh, 0, 0, state.canvasWidth, state.canvasHeight)
    }

    function calculateCanvasWidth() {
      state.canvasWidth = img.value.width / (img.value.height / state.canvasHeight)
    }

    onMounted(() => {
      c = document.getElementById('aiq-img-small')
      ctx = c.getContext('2d')
      ctx.imageSmoothingEnabled = false
      ctx.msImageSmoothingEnabled = false
      ctx.webkitImageSmoothingEnabled = false
    })

    onUnmounted(() => {
      socket.off('AIQ_START_LOAD')
      socket.off('AIQ_START_COUNTDOWN')
      socket.off('AIQ_TIME_UP')
      socket.off('AIQ_RESET')
    })

    function imageLoaded(): void {
      calculateCanvasWidth()
      state.factor = context.root.$store.state.aiq.settings.maxFactor
      context.root.$nextTick(() => {
        redrawImage()
        socket.emit('AIQ_SONG_LOADED')
      })
    }

    return {...toRefs(state), classes, imageLoaded, img}
  }
})
</script>

<style scoped>
img {
  height: 200px;
}

.canvas-hidden {
  position: absolute;
  top: -200%;
}
</style>
