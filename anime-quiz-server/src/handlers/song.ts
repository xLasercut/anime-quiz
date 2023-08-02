import { AbstractHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { Socket } from '../types';

class SongHandler extends AbstractHandler {
  protected _events = {};
}

export { SongHandler };
