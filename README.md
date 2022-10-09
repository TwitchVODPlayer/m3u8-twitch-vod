# m3u8 Twitch VOD
Get any Twitch VOD m3u8.

## Install
```
npm i m3u8-twitch-vod

yarn add m3u8-twitch-vod
```

## Usage
```js
import twitchVod from 'm3u8-twitch-vod'

// Get infos
const infos = await twitchVod.getVodInfos(vod_id)

// Get m3u8 playlist list
const m3u8 = await twitchVod.getM3u8(vod_id)

// Get m3u8 ts list
const access_token = await twitchVod.getAccessToken(vod_id)
const m3u8 = await twitchVod.getM3u8Content(m3u8_playlist_url, access_token)
```