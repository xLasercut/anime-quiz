const NAME_FORMAT = new RegExp('^[A-Za-z0-9 ]+$')
const IMAGE_FORMAT = new RegExp('(.*)\.(png|jpg|jpeg|gif)$', 'i')
const EMOJI_COMMAND_FORMAT = new RegExp('^[A-Za-z0-9]+$')
const EMOJI_CHAT_FORMAT = new RegExp('(:)(?:[^:]+)$', 'ig')
const SERVER_PASSWORD_FORMAT = new RegExp('^[A-Za-z0-9]+$')

export {NAME_FORMAT, SERVER_PASSWORD_FORMAT, IMAGE_FORMAT, EMOJI_COMMAND_FORMAT, EMOJI_CHAT_FORMAT}
