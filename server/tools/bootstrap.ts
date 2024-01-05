import * as Database from 'better-sqlite3';
import { SERVER_CONFIG } from '../src/app/config';

const db = new Database(SERVER_CONFIG.userDbPath);

db.prepare(
  `
CREATE TABLE IF NOT EXISTS user_songs
(
    user_id text not null,
    song_id text not null
)`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS users
(
    discord_id   text    not null
        constraint table_name_pk
            primary key,
    user_id      text    not null,
    display_name text    not null,
    avatar       text    not null,
    admin        integer not null
);
`
).run();

db.close();
