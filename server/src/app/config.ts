import { ServerConfig } from '../models/config';
import * as fs from 'fs';
import { CONFIG_FILEPATH } from './constants';

const SERVER_CONFIG = ServerConfig.parse(JSON.parse(fs.readFileSync(CONFIG_FILEPATH, 'utf-8')));

export { SERVER_CONFIG };
