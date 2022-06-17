<template>
  <v-toolbar-items>
    <panel-volume-control></panel-volume-control>
    <nav-btn color="warning" icon="mdi-backspace-reverse-outline" @click="back()">Back</nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import NavBtn from '../shared/buttons/NavBtn.vue';
import { store } from '../../plugins/store';
import { MUTATIONS } from '../../plugins/store/mutations';
import { ROUTES } from '../../plugins/routing/routes';
import PanelVolumeControl from '../shared/PanelVolumeControl.vue';

export default defineComponent({
  components: { PanelVolumeControl, NavBtn },
  setup() {
    function back(): void {
      store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOBBY);
    }

    return {
      back
    };
  }
});
</script>
