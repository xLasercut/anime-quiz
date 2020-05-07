<template>
  <v-row justify="center">
    <v-col cols="auto" v-for="avatar in avatars" :key="avatar">
      <input :id="avatar" type="radio" :value="avatar" :disabled="disabled" v-model="model"/>
      <label :for="avatar">
        <v-avatar tile size="100px">
          <v-img :src="avatarImage(avatar)"></v-img>
        </v-avatar>
      </label>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {defineComponent, reactive, toRefs, watch} from '@vue/composition-api'
  import {avatarImage} from '@/assets/avatar'

  export default defineComponent({
    props: {
      avatars: {
        required: true
      },
      value: {
        required: true
      },
      disabled: {
        default: false
      }
    },
    setup(props, context) {
      const state = reactive({
        model: props.value
      })

      watch(() => state.model, (val) => {
        context.emit('input', val)
      })

      watch(() => props.value, (val) => {
        state.model = val
      })

      return {...toRefs(state), avatarImage}
    }
  })
</script>


<style scoped>
  input {
    display: none;
  }

  .v-avatar {
    outline: 1px solid black;
    cursor: pointer;
    transition: all 0.1s;
    background-color: white;
  }

  input:checked + label .v-avatar {
    outline: 4px solid var(--v-success-base);
  }

  input:disabled + label .v-avatar {
    filter: grayscale(100%);
    cursor: default;
  }
</style>
