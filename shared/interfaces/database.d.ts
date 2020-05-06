interface ISong {
  songId: string
  anime: Array<string>
  src: string
  title: string
  artist: string
  type: string
}

interface IChoices {
  anime: Array<string>
  title: Array<string>
}

export {ISong, IChoices}
