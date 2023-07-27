import { z } from 'zod';

const UserId = z
  .string()
  .trim()
  .min(1)
  .regex(/^user-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);

export { UserId };
