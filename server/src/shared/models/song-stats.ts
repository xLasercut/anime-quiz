import { z } from 'zod';
import { SongId } from './song';

const SongStatsPlayCount = z.number().min(0);

const SongStats = z.object({
  songId: SongId,
  playCount: SongStatsPlayCount
});

export { SongStats, SongStatsPlayCount };
