import { z } from 'zod';
import { SongId } from '../shared/models/song';
import { SongStatsPlayCount } from '../shared/models/song-stats';

const DbSongStats = z.object({
  song_id: SongId,
  play_count: SongStatsPlayCount
});

export { DbSongStats };
