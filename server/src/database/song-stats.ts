import { DatabaseDataState, gameDbConnection, mainDbConnection, ServerDb } from './common';
import { SongStatsRecordsType, SongStatsType, SongType } from '../shared/models/types';
import { ServerConfig } from '../interfaces';
import { Logger } from 'winston';
import { Database as SqliteDb } from 'better-sqlite3';
import { StatementFactory } from './statement';
import { DbSongStatsType } from '../models/types';
import { DbSongStats } from '../models/song-stats';
import { DataQualityError } from '../app/exceptions';

const STATEMENTS = {
  SELECT_ALL_SONG_STATS: 'SELECT_ALL_SONG_STATS',
  SELECT_SONG_STATS_BY_SONG_ID: 'SELECT_SONG_STATS_BY_SONG_ID',
  INSERT_SONG_STATS: 'INSERT_SONG_STATS',
  EDIT_SONG_STATS: 'EDIT_SONG_STATS',
  DELETE_SONG_STATS: 'DELETE_SONG_STATS'
};

const RAW_STATEMENTS = {
  [STATEMENTS.SELECT_ALL_SONG_STATS]: `
    SELECT
      * 
    FROM song_stats
  `,
  [STATEMENTS.SELECT_SONG_STATS_BY_SONG_ID]: `
    SELECT
      *
    FROM song_stats
    WHERE song_id = @songId
  `,
  [STATEMENTS.INSERT_SONG_STATS]: `
    INSERT INTO song_stats 
      (song_id, play_count) 
    VALUES 
      (@songId, @playCount)
  `,
  [STATEMENTS.EDIT_SONG_STATS]: `
    UPDATE song_stats 
    SET 
      play_count = @playCount
    WHERE song_id = @songId
  `,
  [STATEMENTS.DELETE_SONG_STATS]: `
    DELETE FROM song_stats
    WHERE song_id = @songId
  `
};

class SongStatsDb extends ServerDb<SongStatsType> {
  protected _db: SqliteDb;
  protected _factory: StatementFactory;

  constructor(config: ServerConfig, logger: Logger, state: DatabaseDataState) {
    super(config, logger, state);
    this._db = gameDbConnection(null, config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
    this.reloadCache();
  }

  public getSongStats(): SongStatsType[] {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ALL_SONG_STATS);
    const response = statement.all();
    return response
      .map((item): DbSongStatsType => {
        return DbSongStats.parse(item);
      })
      .map((dbSong): SongStatsType => {
        return {
          songId: dbSong.song_id,
          playCount: dbSong.play_count
        };
      });
  }

  public getSongStatsRecords(): SongStatsRecordsType {
    const records: SongStatsRecordsType = {};
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ALL_SONG_STATS);
    const response = statement.all();
    for (const item of response) {
      const dbSongStats = DbSongStats.parse(item);
      records[dbSongStats.song_id] = dbSongStats.play_count;
    }
    return records;
  }

  public getSongStatsById(song: SongType): SongStatsType | null {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_SONG_STATS_BY_SONG_ID);
    const response = statement.get(song);
    if (!response) {
      return null;
    }
    const dbSongStats = DbSongStats.parse(response);
    return {
      songId: dbSongStats.song_id,
      playCount: dbSongStats.play_count
    };
  }

  public incrementPlayCount(song: SongType) {
    const songStats = this.getSongStatsById(song);
    if (!songStats) {
      this.newRecord({
        songId: song.songId,
        playCount: 1
      });
    } else {
      this.editRecord({
        songId: songStats.songId,
        playCount: songStats.playCount + 1
      });
    }
  }

  public newRecord(record: SongStatsType) {
    const statement = this._factory.getStatement(STATEMENTS.INSERT_SONG_STATS);
    statement.run(record);
    this.reloadCache();
  }

  public editRecord(record: SongStatsType) {
    const statement = this._factory.getStatement(STATEMENTS.EDIT_SONG_STATS);
    statement.run(record);
    this.reloadCache();
  }

  public deleteRecord(record: SongStatsType) {
    const statement = this._factory.getStatement(STATEMENTS.DELETE_SONG_STATS);
    statement.run(record);
    this.reloadCache();
  }

  public validateRecordExists(record: SongStatsType) {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_SONG_STATS_BY_SONG_ID);
    const response = statement.get(record);
    if (!response) {
      throw new DataQualityError('Song stats does not exists');
    }
  }

  public validateRecordNotExists(record: SongStatsType) {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_SONG_STATS_BY_SONG_ID);
    const response = statement.get(record);
    if (response) {
      throw new DataQualityError('Song stats already exists');
    }
  }

  public reloadDb() {
    this._db = mainDbConnection(this._db, this._config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
    this.reloadCache();
  }

  public reloadCache() {}
}

export { SongStatsDb };
