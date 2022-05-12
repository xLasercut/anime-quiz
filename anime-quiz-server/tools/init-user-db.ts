import { ServerConfig } from '../src/app/config'
import { Database } from 'sqlite3'

const config = new ServerConfig()
const db = new Database(config.userDbPath)

db.run(`
CREATE TABLE user_songs
(
    user_id text not null,
    song_id text not null
)`)

db.run(`
CREATE TABLE users
(
    user_id  text not null
        constraint users_pk
            primary key,
    username text
)
`)

db.close()
