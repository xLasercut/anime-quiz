import { z } from 'zod';
import { ClientData } from './client';

export type ClientDataType = z.infer<typeof ClientData>;

