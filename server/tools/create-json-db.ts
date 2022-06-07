import * as fs from 'fs'
import * as path from 'path'
import { ServerConfig } from '../src/app/config'
import { Logger } from '../src/app/logging/logger'
import { AnimeQuizSongDb } from '../src/database/song'

const distDir = path.join(__dirname, '..', 'dist')

const config = new ServerConfig()
const logger = new Logger(config)
const songDb = new AnimeQuizSongDb(config, logger)

fs.writeFileSync(path.join(distDir, 'song-list.json'), JSON.stringify(songDb.getSongList()))
