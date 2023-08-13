import { z } from 'zod';

const GameRoomId = z
  .string()
  .trim()
  .min(1)
  .regex(/^amq-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\|[A-Za-z0-9-_ ]{1,30}$/);

export { GameRoomId };
