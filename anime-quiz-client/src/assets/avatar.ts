import { AVATARS } from './shared/constants'

const AVATAR_MAP = {
  [AVATARS.ZERO_TWO]: 'https://i.imgur.com/qQ0Fkkx.png',
  [AVATARS.INITIAL_D]: 'https://i.imgur.com/fk44rTD.png',
  [AVATARS.MISAKA]: 'https://i.imgur.com/eZ6FZcr.png',
  [AVATARS.EVA_UNIT_1]: 'https://i.imgur.com/aqld5ou.png',
  [AVATARS.HOMURA]: 'https://i.imgur.com/08X3kjC.png',
  [AVATARS.ALPHONSE]: 'https://i.imgur.com/PerwiGF.png',
  [AVATARS.HORO]: 'https://i.imgur.com/oOiDAFl.png',
  [AVATARS.MADOKA]: 'https://i.imgur.com/iGPVIAN.png',
  [AVATARS.LELOUCH]: 'https://i.imgur.com/mB0IKty.png',
  [AVATARS.MIYU]: 'https://i.imgur.com/Jvi0FoN.png',
  [AVATARS.RAWR]: 'https://i.imgur.com/t03jCAX.png',
  [AVATARS.PIKACHU]: 'https://i.imgur.com/QoEzMPR.jpg',
  [AVATARS.EREN]: 'https://i.imgur.com/5Dip9VY.jpg',
  [AVATARS.JUDAI]: 'https://i.imgur.com/IpCOoWU.png',
  [AVATARS.YUGI]: 'https://i.imgur.com/JUdFemG.png'
}

function getAvatarSelect(): string[] {
  return Object.keys(AVATAR_MAP)
}

function getAvatarUrl(avatar: string): string {
  return AVATAR_MAP[avatar] || 'https://i.imgur.com/dFFwfIx.jpg'
}

export {
  getAvatarSelect,
  getAvatarUrl
}
