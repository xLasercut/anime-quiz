import { z } from 'zod';

const AnimeThemesResponseNumber = z.number();
const AnimeThemesResponseString = z.string().trim().min(1);

const AnimeThemesResponseVideo = z.object({
  id: AnimeThemesResponseNumber,
  basename: AnimeThemesResponseString,
  filename: AnimeThemesResponseString,
  resolution: AnimeThemesResponseNumber,
  link: AnimeThemesResponseString
});

const AnimeThemesResponseAnimeThemeEntry = z.object({
  id: AnimeThemesResponseNumber,
  videos: z.array(AnimeThemesResponseVideo).min(1)
});

const AnimeThemesResponseArtist = z.object({
  id: AnimeThemesResponseNumber,
  name: AnimeThemesResponseString,
  slug: AnimeThemesResponseString
});

const AnimeThemesResponseSong = z.object({
  id: AnimeThemesResponseNumber,
  title: AnimeThemesResponseString,
  artists: z.array(AnimeThemesResponseArtist).min(1)
});

const AnimeThemesResponseAnimeTheme = z.object({
  id: AnimeThemesResponseNumber,
  type: AnimeThemesResponseString,
  song: AnimeThemesResponseSong,
  animethemeentries: z.array(AnimeThemesResponseAnimeThemeEntry).min(1)
});

const AnimeThemesResponseAnime = z.object({
  id: AnimeThemesResponseNumber,
  name: AnimeThemesResponseString,
  slug: AnimeThemesResponseString,
  animethemes: z.array(AnimeThemesResponseAnimeTheme).min(1)
});

const AnimeThemesResponse = z.object({
  anime: AnimeThemesResponseAnime
});

export { AnimeThemesResponse, AnimeThemesResponseAnimeTheme, AnimeThemesResponseString };
