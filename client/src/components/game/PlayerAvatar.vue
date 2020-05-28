<template>
  <v-row justify="center">
    <v-col cols="auto">
      <v-badge overlap left :color="badgeColor">
        <v-icon v-if="admin || host" color="white" slot="badge">mdi-crown</v-icon>
        <v-avatar tile size="100px">
          <v-img :src="avatarImage(avatar)" aspect-ratio="1"></v-img>
        </v-avatar>
      </v-badge>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {computed, defineComponent} from '@vue/composition-api'
  import {avatarImage} from '@/assets/avatar'

  export default defineComponent({
    props: {
      avatar: {
        required: true
      },
      host: {
        required: true
      },
      admin: {
        required: true
      }
    },
    setup(props, _context) {

      const badgeColor = computed((): string => {
        if (props.admin) {
          return '#E65100'
        }

        if (props.host) {
          return '#0277BD'
        }

        return 'primary'
      })

      return {avatarImage, badgeColor}
    }
  })
</script>

<style scoped>
  .v-avatar {
    outline: 1px solid black;
    background-color: white;
  }
</style>
