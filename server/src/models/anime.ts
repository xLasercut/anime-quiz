import { AbstractModel } from './abstract';
import { IAnime, IAnimeRaw } from '../shared/interfaces';
import { animeRawSchema, animeSchema } from '../schemas/anime';
import { v4 } from 'uuid';

class AnimeRaw extends AbstractModel<IAnimeRaw> {
  constructor(anime: IAnimeRaw) {
    super(animeRawSchema, anime);
  }

  public toAnime(): Anime {
    const anime: IAnime = {
      anime_id: this._result.value.anime_id,
      anime_name: this._jsonParseList(this._result.value.anime_name)
    };
    return new Anime(anime);
  }
}

class NewAnime extends AbstractModel<IAnime> {
  constructor(_anime: IAnime) {
    const { anime_id, ...rest } = _anime;
    super(animeSchema, { anime_id: `anime-${v4()}`, ...rest });
  }
}

class Anime extends AbstractModel<IAnime> {
  constructor(anime: IAnime) {
    super(animeSchema, anime);
  }
}

export { Anime, NewAnime, AnimeRaw };
