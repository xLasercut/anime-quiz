const NAME_FORMAT = new RegExp('^[A-Za-z0-9 ]+$')
const ROOM_TYPE_FORMAT = new RegExp('^(amq)$')
const IMAGE_FORMAT = new RegExp('(.*)\.(png|jpg|jpeg|gif)$', 'i')
const EMOJI_COMMAND_FORMAT = new RegExp('^[A-Za-z0-9]+$')

export {NAME_FORMAT, ROOM_TYPE_FORMAT, IMAGE_FORMAT, EMOJI_COMMAND_FORMAT}
