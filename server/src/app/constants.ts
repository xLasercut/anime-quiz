import * as path from 'path';

const ROOT_DIR = path.join(__dirname, '..', '..');
const CONFIG_FILEPATH = path.join(ROOT_DIR, 'config', 'config.json');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PRIMARY_DATA_DIR = path.join(DATA_DIR, 'primary');
const SECONDARY_DATA_DIR = path.join(DATA_DIR, 'secondary');
const LOG_DIR = path.join(ROOT_DIR, 'log');
const MAIN_DB_PATH = path.join(PRIMARY_DATA_DIR, 'anime-quiz.db');
const USER_DB_PATH = path.join(SECONDARY_DATA_DIR, 'anime-quiz-user.db');
const GAME_DB_PATH = path.join(SECONDARY_DATA_DIR, 'anime-quiz-game.db');

export { ROOT_DIR, DATA_DIR, PRIMARY_DATA_DIR, SECONDARY_DATA_DIR, LOG_DIR, MAIN_DB_PATH, USER_DB_PATH, GAME_DB_PATH, CONFIG_FILEPATH };
