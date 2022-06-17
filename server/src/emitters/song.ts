import { AbstractEmitter } from './abstract';
import { Server } from '../app/server';
import { AnimeQuizSongDb } from '../database/song';
import { SHARED_EVENTS } from '../shared/events';

class SongDbEmitter extends AbstractEmitter {
  protected _songDb: AnimeQuizSongDb;

  constructor(io: Server, songDb: AnimeQuizSongDb) {
    super(io);
    this._songDb = songDb;
  }

  public updateAnimeList(sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_ANIME_LIST, this._songDb.getAnimeList());
  }

  public updateSongList(sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_SONG_LIST, this._songDb.getSongList());
  }

  public updateSongTitleList(sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_SONG_TITLE_LIST, this._songDb.getSongTitleList());
  }
}

export { SongDbEmitter };
