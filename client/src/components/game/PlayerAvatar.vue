<template>
  <v-row justify="center">
    <v-col cols="auto">
      <v-badge overlap left :color="badgeColor">
        <v-icon v-if="admin || host" color="white" slot="badge">mdi-crown</v-icon>
        <game-avatar tile size="100px" :avatar="avatar"></game-avatar>
      </v-badge>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {computed, defineComponent} from '@vue/composition-api'
  import GameAvatar from '@/components/GameAvatar.vue'

  export default defineComponent({
    components: {
      GameAvatar
    },
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

      return {badgeColor}
    }
  })
</script>

<style scoped>
  .v-avatar {
    outline: 1px solid black;
    background-color: white;
  }
</style>
