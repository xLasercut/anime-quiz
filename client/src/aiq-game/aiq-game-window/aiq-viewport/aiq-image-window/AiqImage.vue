<template>
  <v-col cols="12">
    <v-slider v-model="factor" min="30" max="100"></v-slider>
    <canvas id="demo" :width="imageWidth()" height="200"></canvas>
  </v-col>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs, watch} from '@vue/composition-api'

export default defineComponent({
  setup(_props, _context) {
    const state = reactive({
      factor: 1,
      img: new Image()
    })

    let c: any = null
    let ctx: any = null

    watch(() => state.factor, (val) => {
      state.img.src = 'https://www.otakuninjahero.com/image/cache/catalog/Katana/KAT0231-1-1000x1000.jpg'

      let fw = (state.img.width / state.factor)|0
      let fh = (state.img.height / state.factor)|0
      ctx.drawImage(state.img, 0, 0, fw, fh)
      ctx.drawImage(c, 0, 0, fw, fh, 0, 0, imageWidth(), 200)
    })

    function imageWidth(): number {
      return state.img.height / (state.img.width / 200)
    }



    onMounted(() => {
      //@ts-ignore
      c = document.getElementById('demo')
      ctx = c.getContext('2d')
      ctx.imageSmoothingEnabled = false
      ctx.mozImageSmoothingEnabled = false
      ctx.msImageSmoothingEnabled = false
      ctx.webkitImageSmoothingEnabled = false
    })

    return {...toRefs(state), imageWidth}
  }
})
</script>
