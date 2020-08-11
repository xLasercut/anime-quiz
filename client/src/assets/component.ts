import LoginView from '@/login/LoginView.vue'
import LoginPanel from '@/login/LoginPanel.vue'
import LobbyView from '@/lobby/LobbyView.vue'
import AmqSongView from '@/amq-song/AmqSongView.vue'
import AmqSongPanel from '@/amq-song/AmqSongPanel.vue'
import EmojiPanel from '@/emoji/EmojiPanel.vue'
import EmojiView from '@/emoji/EmojiView.vue'
import ChatBotPanel from '@/chat-bot/ChatBotPanel.vue'
import ChatBotView from '@/chat-bot/ChatBotView.vue'

const PANEL_COMPONENTS: { [key: string]: any } = {
  login: LoginPanel,
  amq_song: AmqSongPanel,
  emoji: EmojiPanel,
  chat_bot: ChatBotPanel
}

const VIEW_COMPONENTS: { [key: string]: any } = {
  login: LoginView,
  lobby: LobbyView,
  amq_song: AmqSongView,
  emoji: EmojiView,
  chat_bot: ChatBotView
}

export {PANEL_COMPONENTS, VIEW_COMPONENTS}
