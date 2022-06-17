<template>
  <div :class="messageRowClass">
    <div class="avatar-container">
      <game-avatar :avatar="message.avatar" v-if="!message.repeat"></game-avatar>
    </div>
    <div class="text-container">
      <div :class="nameClass" v-if="!message.repeat">
        <b>{{ message.username }}</b>
      </div>
      <div class="chat-text" v-html="chatMessage()"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api';
import GameAvatar from '../../shared/GameAvatar.vue';
import { AqGameChatMessage } from '../../../assets/shared/interfaces';
import { store } from '../../../plugins/store';

export default defineComponent({
  components: { GameAvatar },
  props: {
    message: {
      required: true,
      type: Object as PropType<AqGameChatMessage>
    }
  },
  setup(props, _context) {
    const nameClass = computed(() => {
      const classes = ['chat-username'];
      if (props.message.admin) {
        classes.push('admin');
      }
      return classes.join(' ');
    });

    const messageRowClass = computed(() => {
      const classes = ['message-row'];
      if (props.message.repeat) {
        classes.push('repeat-message-row');
      }
      return classes.join(' ');
    });

    function chatMessage(): string {
      let output = props.message.text;
      for (const emoji of store.getters.emojiList) {
        const command = new RegExp(`:${emoji.command}:`, 'gi');
        const type = emoji.type;
        const src = emoji.src;

        if (type === 'img') {
          output = output.replace(command, `<img src="${src}" class="emoji" />`);
        } else if (type === 'dec') {
          output = output.replace(command, src);
        }
      }
      return output;
    }

    return {
      nameClass,
      messageRowClass,
      chatMessage
    };
  }
});
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
  color: #d08770;
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
