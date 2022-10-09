const M3U8_HEADER = `#EXTM3U\n#EXT-X-TWITCH-INFO:ORIGIN="s3",B="false",REGION="EU",CLUSTER="cloudfront_vod",USER-COUNTRY="FR",MANIFEST-CLUSTER="cloudfront_vod"`
const BANDWIDTHS: twitch.Bandwidths = {
    "160p30": 290813,
    "360p30": 728036,
    "480p30": 1395738,
    "720p30": 2155370,
    "720p60": 2969103,
    "1080p30": 5657741,
    "1080p60": 6384683,
    "1440p30": 6384683,
    "1440p60": 7384683,
    "chunked": 6486612,
}
const M3U8_QUALITY = (quality: string, resolution: string, fps: number) => `#EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="${quality}",NAME="${quality}",AUTOSELECT=YES,DEFAULT=YES\n#EXT-X-STREAM-INF:${BANDWIDTHS[quality] === undefined ? '' : `BANDWIDTH=${BANDWIDTHS[quality]},`}CODECS="avc1.4D401F,mp4a.40.2",RESOLUTION=${resolution},VIDEO="${quality}${fps === undefined ? '' : `,FRAME-RATE=${fps.toFixed(3) }`}"`

/**
 * Get infos of a specific VOD
 * @param vod_id id of the VOD
 */
export async function getVodInfos(vod_id: number): Promise<twitch.VODInfos> {
  return fetch(`https://api.twitch.tv/kraken/videos/${vod_id}`, {
    headers: {
      "Accept": "application/vnd.twitchtv.v5+json",
      "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko"
    }
  }).then(res => res.json())
}

/**
 * Get m3u8 file url.
 * @param vod_id id of the vod
 */
export async function getM3u8(vod_id: number): Promise<string> {
  const access_token = await getAccessToken(vod_id)
  const content = await getM3u8Content(`https://usher.ttvnw.net/vod/${vod_id}.m3u8`, access_token)
  if (!content?.startsWith("#EXTM3U")) return getSubM3u8(vod_id) // sub-only
  return content
}

/**
 * Get m3u8 ts file buffer.
 * @param url url of the ts file
 * @param access_token
 */
export async function getTsBuffer(url: string, access_token: twitch.AccessToken): Promise<Buffer> {
  return fetch(prepareUrl(url, access_token), { headers: { "Content-Type": "arraybuffer" } }).then(res => res.arrayBuffer()).then(buf => Buffer.from(buf))
}

/**
 * Get access token to a specific VOD.
 * @param vod_id id of the VOD
 */
export async function getAccessToken(vod_id: number): Promise<twitch.AccessToken> {
  return fetch("https://gql.twitch.tv/gql", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko"
    },
    body: '{"operationName":"PlaybackAccessToken","variables":{"isLive":false,"login":"","isVod":true,"vodID":"' + vod_id + '","playerType":"channel_home_live"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712"}}}'
  })
    .then(res => res.json())
    .then(json => {
      const token = json?.data?.videoPlaybackAccessToken
      if (!token) throw new Error("Invalid VOD id")
      return {
        signature: token.signature,
        value: token.value
      }
    })
}

/**
 * Get m3u8 file content.
 * @param url
 * @param access_token
 */
export async function getM3u8Content(url: string, access_token: twitch.AccessToken): Promise<string> {
  return fetch(prepareUrl(url, access_token)).then(res => res.text()).then(res => res)
}

/**
 * Create m3u8 file content of a sub-only VOD.
 * @param vod_id
 */
async function getSubM3u8(vod_id: number): Promise<string> {
  const { seek_previews_url, resolutions, fps } = await getVodInfos(vod_id)
  const base_url = seek_previews_url?.match(/^(https:\/\/.+)\/storyboards\/(.+)$/)?.[1] || ''
  return `${M3U8_HEADER}${Object.entries(resolutions).map(([quality, resolution]) => `\n${M3U8_QUALITY(quality, resolution, fps[quality])}\n${base_url}/${quality}/index-dvr.m3u8`).join('')}`
}

/**
 * Create url with access token.
 * @param url
 * @param access_token
 */
function prepareUrl(url: string, access_token: twitch.AccessToken): string {
  const dom_url = new URL(url)
  dom_url.search = new URLSearchParams({
    sig: access_token.signature,
    token: access_token.value,
    allow_source: "true",
    player: "twitchweb",
    allow_spectre: "true",
    allow_audio_only: "true"
  }).toString()
  return dom_url.toString()
}