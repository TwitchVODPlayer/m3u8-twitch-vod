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
twitchVod.getVodInfos(vod_id).then(infos => {
    // handle
}).catch(err => { /**/ })

// Get m3u8 playlist content
twitchVod.getM3u8(vod_id).then(m3u8 => {
    // handle
}).catch(err => { /**/ })

// Get m3u8 ts content
twitchVod.getAccessToken(1447161414).then(access_token => {
    twitchVod.getM3u8Content(m3u8_playlist_url, access_token).then(m3u8 => {
        // handle
    })
}).catch(err => { /**/ })
```