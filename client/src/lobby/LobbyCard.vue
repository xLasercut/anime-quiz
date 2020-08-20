<template>
  <v-col cols="auto" v-if="showCard">
    <v-card width="250px" flat>
      <v-card-title :class="`${card.color}--text`">
        <v-icon large left :class="`${card.color}--text`">{{ card.icon }}</v-icon>
        <span class="title">{{ card.label }}</span>
      </v-card-title>

      <v-card-text>
        <span>{{ card.description }}</span>
      </v-card-text>

      <v-card-actions>
        <icon-btn
          icon="mdi-login"
          :color="card.color"
          @click="$emit('join:room', card.command)"
          v-if="card.command"
        >
          Start
        </icon-btn>
        <icon-btn icon="mdi-trademark" disabled v-else>SOON</icon-btn>
      </v-card-actions>
      <div>
      </div>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import {computed, defineComponent} from '@vue/composition-api'
import IconBtn from '@/components/buttons/IconBtn.vue'
import {ILobbyCard} from '@/assets/interfaces'

interface IProp {
  card: ILobbyCard
}

export default defineComponent<IProp>({
  components: {
    IconBtn
  },
  props: {
    card: {
      required: true
    }
  },
  setup(props, context) {
    const showCard = computed(() => {
      if (props.card.isAdmin) {
        return context.root.$store.state.client.admin
      }
      return true
    })

    return {showCard}
  }
})
</script>
