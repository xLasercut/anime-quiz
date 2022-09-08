import {
  ALPHONSE,
  EREN,
  EVA_UNIT_1,
  HOMURA,
  HORO,
  INITIAL_D,
  JUDAI,
  LELOUCH,
  MADOKA,
  MISAKA,
  MIYU,
  PIKACHU,
  RAWR,
  YUGI,
  ZERO_TWO
} from './shared/constants/avatars';
import { IGameAvatar } from './shared/interfaces/game';

const AVATAR_MAP = {
  [ZERO_TWO]: 'https://i.imgur.com/qQ0Fkkx.png',
  [INITIAL_D]: 'https://i.imgur.com/fk44rTD.png',
  [MISAKA]: 'https://i.imgur.com/eZ6FZcr.png',
  [EVA_UNIT_1]: 'https://i.imgur.com/aqld5ou.png',
  [HOMURA]: 'https://i.imgur.com/08X3kjC.png',
  [ALPHONSE]: 'https://i.imgur.com/PerwiGF.png',
  [HORO]: 'https://i.imgur.com/oOiDAFl.png',
  [MADOKA]: 'https://i.imgur.com/iGPVIAN.png',
  [LELOUCH]: 'https://i.imgur.com/mB0IKty.png',
  [MIYU]: 'https://i.imgur.com/Jvi0FoN.png',
  [RAWR]: 'https://i.imgur.com/t03jCAX.png',
  [PIKACHU]: 'https://i.imgur.com/QoEzMPR.jpg',
  [EREN]: 'https://i.imgur.com/5Dip9VY.jpg',
  [JUDAI]: 'https://i.imgur.com/IpCOoWU.png',
  [YUGI]: 'https://i.imgur.com/JUdFemG.png'
};

function getAvatarSelect(): string[] {
  return Object.keys(AVATAR_MAP);
}

function getAvatarUrl(avatar: IGameAvatar): string {
  return AVATAR_MAP[avatar] || 'https://i.imgur.com/dFFwfIx.jpg';
}

export { getAvatarSelect, getAvatarUrl };
