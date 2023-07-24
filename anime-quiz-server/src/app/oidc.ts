const CLIENT_ID = ""
const CLIENT_SECRET = ""
const REDIRECT_URI = "http://localhost:8080/login"


const DISCORD_URL = `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`

console.log(DISCORD_URL)


export {DISCORD_URL, REDIRECT_URI}
