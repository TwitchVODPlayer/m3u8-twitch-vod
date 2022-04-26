import twitchVod from "../dist/index.js"


function printVodInfos(vodId) {
    twitchVod.getVodInfos(vodId).then(infos => {
        console.log(infos)
    }).catch(console.error)
}

function printVodM3u8(vodId) {
    twitchVod.getM3u8(vodId).then(m3u8 => {
        console.log(m3u8)
    }).catch(console.error)
}

function printM3u8Content(m3u8_url) {
    twitchVod.getAccessToken(1447161414).then(access_token => {
        twitchVod.getM3u8Content(m3u8_url, access_token).then(m3u8 => {
            console.log(m3u8)
        })
    }).catch(console.error)
}


const public_vod = 1451786606 // public
const public_vod_160p = 'https://dgeft87wbj63p.cloudfront.net/cc32cf886cfea3825c04_bagherajones_45151824300_1649177689/160p30/index-dvr.m3u8' // public - 160p30
const sub_vod = 1443293766 // sub-only
const sub_vod_160p = 'https://dgeft87wbj63p.cloudfront.net/08feec490b85390a1360_xari_45116915452_1648837205/160p30/index-dvr.m3u8' // public - 160p30

// test get VOD infos
// printVodInfos(public_vod)
// printVodInfos(sub_vod)
// test get VOD m3u8
printVodM3u8(public_vod)
printVodM3u8(sub_vod)
// test get m3u8 content
// printM3u8Content(public_vod_160p)
// printM3u8Content(sub_vod_160p)