import { ISong, ISongRaw, ISongTitleRaw } from '../shared/interfaces';
import { AbstractModel } from './abstract';
import { newSongSchema, songRawSchema, songSchema, songTitleRawSchema } from '../schemas/song';
import { v4 } from 'uuid';

class SongRaw extends AbstractModel<ISongRaw> {
  constructor(song: ISongRaw) {
    super(songRawSchema, song);
  }

  public toSong(): Song {
    const { anime_id, anime_name, ...rest } = this._result.value;
    const song: ISong = {
      ...rest,
      anime_id: this._jsonParseList(anime_id),
      anime_name: Array.from(new Set(this._jsonParseList(anime_name)))
    };
    return new Song(song);
  }
}

class NewSong extends AbstractModel<ISong> {
  constructor(_song: ISong) {
    const { song_id, ...rest } = _song;
    super(newSongSchema, { ...rest, song_id: `song-${v4()}` });
  }
}

class Song extends AbstractModel<ISong> {
  constructor(song: ISong) {
    super(songSchema, song);
  }
}

class SongTitleRaw extends AbstractModel<ISongTitleRaw> {
  constructor(songTitle: ISongTitleRaw) {
    super(songTitleRawSchema, songTitle);
  }
}

export { Song, NewSong, SongRaw, SongTitleRaw };
