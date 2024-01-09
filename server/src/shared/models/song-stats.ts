import { z } from 'zod';
import { Song, SongId } from './song';

const SongStatsPlayCount = z.number().min(0);

const SongStats = z.object({
  songId: SongId,
  playCount: SongStatsPlayCount
});

const CombinedSongStats = z.intersection(
  Song,
  z.object({
    playCount: SongStatsPlayCount
  })
);

export { SongStats, SongStatsPlayCount, CombinedSongStats };
