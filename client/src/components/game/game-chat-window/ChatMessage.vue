<template>
  <div :class="messageRowClass">
    <div class="avatar-container">
      <game-avatar :avatar="message.avatar" v-if="!message.repeat"></game-avatar>
    </div>
    <div class="text-container">
      <div :class="nameClass" v-if="!message.repeat">
        <b>{{message.user}}</b>
        <v-icon color="#E65100" v-if="message.admin">mdi-crown</v-icon>
      </div>
      <div class="chat-text" v-html="message.text"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from '@vue/composition-api'
import GameAvatar from '@/components/GameAvatar.vue'
import {IChat} from '../../../../../shared/interfaces/game'

interface IProps {
  message: IChat
}

export default defineComponent<IProps>({
  components: {
    GameAvatar
  },
  props: {
    message: {
      required: true
    }
  },
  setup(props, _context) {
    const nameClass = computed(() => {
      let classes = ['chat-username']
      if (props.message.admin) {
        classes.push('admin')
      }
      return classes.join(' ')
    })

    const messageRowClass = computed(() => {
      let classes = ['message-row']
      if (props.message.repeat) {
        classes.push('repeat-message-row')
      }
      return classes.join(' ')
    })

    return {nameClass, messageRowClass}
  }
})
</script>


<style scoped>
.message-row {
  width: 100%;
  float: left;
  margin-top: 10px;
}

.avatar-container {
  width: 48px;
  height: 100%;
  float: left;
  margin-top: 2px;
}

.text-container {
  width: calc(100% - 58px);
  float: left;
  white-space: pre-wrap;
}

.chat-username {
  width: 100%;
  float: left;
  padding-left: 10px;
  font-size: 14pt;
}

.chat-text {
  width: 100%;
  float: left;
  padding-left: 10px;
  font-size: 12pt;
}

.admin {
  color: #E65100;
}

.repeat-message-row {
  margin-top: 0;
}
</style>

<style>
.emoji {
  padding: 0;
  margin: 0;
  width: 16pt;
  position: relative;
  top: 3px;
}
</style>
