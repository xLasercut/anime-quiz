import { z } from 'zod';
import { SongId } from 'anime-quiz-shared-resources/src/models/song';
import { SongStatsPlayCount } from 'anime-quiz-shared-resources/src/models/song-stats';

const DbSongStats = z.object({
  song_id: SongId,
  play_count: SongStatsPlayCount
});

export { DbSongStats };
