import * as path from 'path'

/************* PATHS *****************/

const ROOT_DIR = path.join(__dirname, '..')

const LOG_DIR = path.join(ROOT_DIR, 'log')
const DATA_DIR = path.join(ROOT_DIR, 'data')
const USER_DATA_DIR = path.join(DATA_DIR, 'user')

const SONG_LIST_PATH = path.join(DATA_DIR, 'song-list.json')
const EMOJI_LIST_PATH = path.join(DATA_DIR, 'emoji.json')


/************* SERVER *****************/
const SERVER_PASSWORD = process.env.SERVER_PASSWORD || 'server'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password'
const SERVER_PORT = 3001

export {LOG_DIR, DATA_DIR, USER_DATA_DIR, SERVER_PASSWORD, SERVER_PORT, ADMIN_PASSWORD, SONG_LIST_PATH, EMOJI_LIST_PATH}
