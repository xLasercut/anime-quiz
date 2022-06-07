import * as fs from 'fs'
import * as path from 'path'
import { ServerConfig } from '../src/app/config'
import { Logger } from '../src/app/logging/logger'
import { AnimeQuizSongDb } from '../src/database/song'
import { AnimeQuizEmojiDb } from '../src/database/emoji'

const distDir = path.join(__dirname, '..', 'dist')

const config = new ServerConfig()
const logger = new Logger(config)
const songDb = new AnimeQuizSongDb(config, logger)
const emojiDb = new AnimeQuizEmojiDb(config, logger)

fs.writeFileSync(path.join(distDir, 'song-list.json'), JSON.stringify(songDb.getSongList()))
fs.writeFileSync(path.join(distDir, 'anime-list.json'), JSON.stringify(songDb.getAnimeList()))
fs.writeFileSync(path.join(distDir, 'song-title-list.json'), JSON.stringify(songDb.getSongTitleList()))
fs.writeFileSync(path.join(distDir, 'emoji-list.json'), JSON.stringify(emojiDb.getEmojiList()))
