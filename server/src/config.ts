import * as path from 'path'
import {IBannerColor} from '../../shared/types/game'

/************* PATHS *****************/

const ROOT_DIR = path.join(__dirname, '..')

const LOG_DIR = path.join(ROOT_DIR, 'log')
const DATA_DIR = path.join(ROOT_DIR, 'data')
const AMQ_USER_DATA_DIR = path.join(DATA_DIR, 'amq-user')

const AMQ_SONG_LIST_PATH = path.join(DATA_DIR, 'amq-song.json')
const EMOJI_LIST_PATH = path.join(DATA_DIR, 'emoji.json')
const CHAT_BOT_LIST_PATH = path.join(DATA_DIR, 'chat-bot.json')
const AIQ_IMAGE_LIST_PATH = path.join(DATA_DIR, 'aiq-image.json')

/************* SERVER *****************/
const SERVER_PASSWORD = process.env.SERVER_PASSWORD || 'server'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password'
const SERVER_PORT = 3001


/************ ROOM NAMES ************/
const ROOM_IDS = {
  amqSongList: 'amq-song-list',
  awqImageList: 'awq-image-list',
  chatBotList: 'chat-bot-list',
  emojiList: 'emoji-list'
}

export {
  LOG_DIR,
  DATA_DIR,
  SERVER_PASSWORD,
  SERVER_PORT,
  ADMIN_PASSWORD,
  EMOJI_LIST_PATH,
  CHAT_BOT_LIST_PATH,
  AMQ_SONG_LIST_PATH,
  AMQ_USER_DATA_DIR,
  AIQ_IMAGE_LIST_PATH,
  ROOM_IDS
}
