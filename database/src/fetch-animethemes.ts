import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'
import {DATA_DIR} from './constants'

function writeFile(data, page: number): void {
  console.log(`Writing page: ${page}`)
  fs.writeFileSync(path.join(DATA_DIR, `animethemes-raw-${page}.json`), JSON.stringify(data, null, 2))
  console.log(`Finished writing page: ${page}`)
}

async function getAnimeThemesData() {
  for (let page = 1; page < 39; page++) {
    console.log(`Fetching page: ${page}`)
    const url = `https://staging.animethemes.moe/api/anime?include=animethemes.animethemeentries.videos,animethemes.song,animethemes.song.artists&page%5Bsize%5D=100&page%5Bnumber%5D=${page}`
    const response = await axios.get(url)
    console.log(response.data.meta)
    console.log(response.data.links)
    writeFile(response.data.anime, page)
  }
}

getAnimeThemesData()
  .then(() => {})
  .catch((error) => {
    console.log(error)
  })
