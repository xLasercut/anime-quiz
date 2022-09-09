import { AbstractModel } from './abstract';
import { IEmoji } from '../shared/interfaces';
import { emojiSchema } from '../schemas/emoji';
import { v4 } from 'uuid';

class NewEmoji extends AbstractModel<IEmoji> {
  constructor(_emoji: IEmoji) {
    const { emoji_id, ...rest } = _emoji;
    super(emojiSchema, { ...rest, emoji_id: `emoji-${v4()}` });
  }
}

class Emoji extends AbstractModel<IEmoji> {
  constructor(emoji: IEmoji) {
    super(emojiSchema, emoji);
  }
}

export { Emoji, NewEmoji };
