import Database, { Database as SqliteDb } from 'better-sqlite3';
import { SERVER_CONFIG } from '../src/app/config';

function databaseConnection(filepath: string): SqliteDb {
  const db = new Database(filepath);
  db.pragma('journal_mode = WAL');
  return db;
}

const userDb = databaseConnection(SERVER_CONFIG.userDbPath);
const gameDb = databaseConnection(SERVER_CONFIG.gameDbPath);

userDb
  .prepare(
    `
CREATE TABLE IF NOT EXISTS user_songs
(
    user_id text not null,
    song_id text not null
)
`
  )
  .run();

userDb
  .prepare(
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
  )
  .run();

gameDb
  .prepare(
    `
CREATE TABLE IF NOT EXISTS song_stats
(
    song_id    text    not null
        constraint song_id
            primary key,
    play_count integer not null
);
`
  )
  .run();

userDb.close();
gameDb.close();
