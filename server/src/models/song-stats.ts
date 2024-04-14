import { z } from 'zod';
import { SongId } from 'anime-quiz-shared-resources';
import { SongStatsPlayCount } from 'anime-quiz-shared-resources';

const DbSongStats = z.object({
  song_id: SongId,
  play_count: SongStatsPlayCount
});

export { DbSongStats };
