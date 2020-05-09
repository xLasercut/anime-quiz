<template>
  <v-container fluid>
    <nav-panel
      show-home :show-back="showBack"
      @screen:back="backToRoomList()"
    >
      <component :is="controlsComponent"></component>
    </nav-panel>
    <v-content>
      <component :is="component"></component>
    </v-content>
  </v-container>
</template>

<script lang="ts">
  import {computed, defineComponent, onMounted} from '@vue/composition-api'
  import NavPanel from '@/components/NavPanel.vue'
  import RoomList from '@/game/RoomList.vue'
  import Amq from '@/game/Amq.vue'
  import {socket} from '@/assets/socket'
  import RoomListControls from '@/game/room-list/RoomListControls.vue'

  const componentMap: { [key: string]: any } = {
    'list': RoomList,
    'amq': Amq
  }

  const controlComponentMap: {[key: string]: any} = {
    'list': RoomListControls
  }

  export default defineComponent({
    components: {
      NavPanel
    },
    setup(_props, context) {
      const component = computed(() => {
        return componentMap[context.root.$store.state.client.roomMode]
      })

      const controlsComponent = computed(() => {
        return controlComponentMap[context.root.$store.state.client.roomMode]
      })

      const showBack = computed((): boolean => {
        return (context.root.$store.state.client.roomMode !== 'list')
      })

      function backToRoomList(): void {
        socket.emit('LEAVE_ROOM')
        context.root.$store.commit('UPDATE_ROOM_MODE', 'list')
      }

      onMounted(() => {
        if (socket.disconnected) {
          context.root.$router.push('/login')
        }
      })

      return {component, showBack, backToRoomList, controlsComponent}
    }
  })
</script>
