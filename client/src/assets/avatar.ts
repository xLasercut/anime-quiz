let AVATAR_MAP: { [key: string]: string } = {
  'zero_2': 'https://i.imgur.com/qQ0Fkkx.png',
  'initial_d': 'https://i.imgur.com/fk44rTD.png',
  'misaka': 'https://i.imgur.com/eZ6FZcr.png',
  'eva_unit_1': 'https://i.imgur.com/aqld5ou.png',
  'taj': 'https://i.imgur.com/08X3kjC.png',
  'alphonse': 'https://i.imgur.com/PerwiGF.png',
  'horo': 'https://i.imgur.com/oOiDAFl.png',
  'madoka': 'https://i.imgur.com/iGPVIAN.png',
  'lelouch': 'https://i.imgur.com/mB0IKty.png',
  'miyu': 'https://i.imgur.com/Jvi0FoN.png',
  'rawr': 'https://i.imgur.com/t03jCAX.png',
  'pikachu': 'https://i.imgur.com/QoEzMPR.jpg',
  'eren': 'https://i.imgur.com/5Dip9VY.jpg',
  'jaden': 'https://i.imgur.com/emAT9yb.png',
  'yugi': 'https://i.imgur.com/Gfb2pnD.png'
}


function avatarImage(avatar: string): string {
  if (avatar in AVATAR_MAP) {
    return AVATAR_MAP[avatar]
  }
  return 'img/dead_link.jpg'
}

export {avatarImage}
