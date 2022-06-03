import { ServerConfig } from '../src/app/config'
import * as Database from 'better-sqlite3'

const config = new ServerConfig()
const db = new Database(config.userDbPath)

db.prepare(`
CREATE TABLE user_songs
(
    user_id text not null,
    song_id text not null
)`).run()

db.prepare(`
CREATE TABLE users
(
    user_id  text not null
        constraint users_pk
            primary key,
    username text
)
`).run()

db.close()
