import { z } from 'zod';
import { DbUser } from './user';

export type DbUserType = z.infer<typeof DbUser>;
