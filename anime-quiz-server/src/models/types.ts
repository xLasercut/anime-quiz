import { z } from 'zod';
import { DbUser } from './user';

type DbUserType = z.infer<typeof DbUser>;

export { DbUserType };
