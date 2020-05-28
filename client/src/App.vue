<template>
  <v-app>
    <system-notification></system-notification>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
  import {defineComponent, onMounted} from '@vue/composition-api'
  import SystemNotification from '@/app/SystemNotification.vue'
  import {socket} from '@/assets/socket'

  export default defineComponent({
    components: {
      SystemNotification
    },
    setup(_props, context) {
      onMounted(() => {
        if (localStorage.dark) {
          context.root.$vuetify.theme.dark = (localStorage.dark === 'true')
        }

        socket.on('disconnect', (): void => {
          if (context.root.$route.path !== '/login') {
            context.root.$router.push('/login')
          }
        })
      })

      return {}
    }
  })
</script>

<style>
  .game-window {
    height: calc(100vh - 85px);
    overflow: auto;
  }

  .chat-window {
    height: calc(100vh - 85px);
    border-radius: 5px;
    background-color: var(--v-background-darken1) !important;
  }

  .v-application {
    background-color: var(--v-background-base) !important;
  }

  .v-input__slot {
    background-color: var(--v-background-darken1) !important;
  }

  .dialog-item .v-input__slot {
    background-color: var(--v-background-base) !important;
  }

  .v-sheet {
    background-color: var(--v-background-darken1) !important;
  }

  .v-data-table {
    background-color: var(--v-background-darken1) !important;
  }

  .v-data-table tr:hover {
    background-color: var(--v-background-base) !important;
  }

  .v-pagination__item {
    background-color: var(--v-background-base) !important;
  }

  .v-pagination__item:hover {
    background-color: var(--v-primary-base) !important;
  }

  .v-pagination__navigation {
    background-color: var(--v-background-base) !important;
  }

  .v-pagination__navigation:hover {
    background-color: var(--v-primary-base) !important;
  }

  .v-list-item--link:hover {
    background-color: var(--v-background-base) !important;
  }

  .v-slider__thumb-container {
    cursor: pointer;
  }
</style>
