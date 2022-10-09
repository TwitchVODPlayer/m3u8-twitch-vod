"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getM3u8Content = exports.getAccessToken = exports.getTsBuffer = exports.getM3u8 = exports.getVodInfos = void 0;
const M3U8_HEADER = `#EXTM3U\n#EXT-X-TWITCH-INFO:ORIGIN="s3",B="false",REGION="EU",CLUSTER="cloudfront_vod",USER-COUNTRY="FR",MANIFEST-CLUSTER="cloudfront_vod"`;
const BANDWIDTHS = {
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
};
const M3U8_QUALITY = (quality, resolution, fps) => `#EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="${quality}",NAME="${quality}",AUTOSELECT=YES,DEFAULT=YES\n#EXT-X-STREAM-INF:${BANDWIDTHS[quality] === undefined ? '' : `BANDWIDTH=${BANDWIDTHS[quality]},`}CODECS="avc1.4D401F,mp4a.40.2",RESOLUTION=${resolution},VIDEO="${quality}${fps === undefined ? '' : `,FRAME-RATE=${fps.toFixed(3)}`}"`;
/**
 * Get infos of a specific VOD
 * @param vod_id id of the VOD
 */
function getVodInfos(vod_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch(`https://api.twitch.tv/kraken/videos/${vod_id}`, {
            headers: {
                "Accept": "application/vnd.twitchtv.v5+json",
                "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko"
            }
        }).then(res => res.json());
    });
}
exports.getVodInfos = getVodInfos;
/**
 * Get m3u8 file url.
 * @param vod_id id of the vod
 */
function getM3u8(vod_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const access_token = yield getAccessToken(vod_id);
        const content = yield getM3u8Content(`https://usher.ttvnw.net/vod/${vod_id}.m3u8`, access_token);
        if (!(content === null || content === void 0 ? void 0 : content.startsWith("#EXTM3U")))
            return getSubM3u8(vod_id); // sub-only
        return content;
    });
}
exports.getM3u8 = getM3u8;
/**
 * Get m3u8 ts file buffer.
 * @param url url of the ts file
 * @param access_token
 */
function getTsBuffer(url, access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch(prepareUrl(url, access_token), { headers: { "Content-Type": "arraybuffer" } }).then(res => res.arrayBuffer()).then(buf => Buffer.from(buf));
    });
}
exports.getTsBuffer = getTsBuffer;
/**
 * Get access token to a specific VOD.
 * @param vod_id id of the VOD
 */
function getAccessToken(vod_id) {
    return __awaiter(this, void 0, void 0, function* () {
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
            var _a;
            const token = (_a = json === null || json === void 0 ? void 0 : json.data) === null || _a === void 0 ? void 0 : _a.videoPlaybackAccessToken;
            if (!token)
                throw new Error("Invalid VOD id");
            return {
                signature: token.signature,
                value: token.value
            };
        });
    });
}
exports.getAccessToken = getAccessToken;
/**
 * Get m3u8 file content.
 * @param url
 * @param access_token
 */
function getM3u8Content(url, access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch(prepareUrl(url, access_token)).then(res => res.text()).then(res => res);
    });
}
exports.getM3u8Content = getM3u8Content;
/**
 * Create m3u8 file content of a sub-only VOD.
 * @param vod_id
 */
function getSubM3u8(vod_id) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { seek_previews_url, resolutions, fps } = yield getVodInfos(vod_id);
        const base_url = ((_a = seek_previews_url === null || seek_previews_url === void 0 ? void 0 : seek_previews_url.match(/^(https:\/\/.+)\/storyboards\/(.+)$/)) === null || _a === void 0 ? void 0 : _a[1]) || '';
        return `${M3U8_HEADER}${Object.entries(resolutions).map(([quality, resolution]) => `\n${M3U8_QUALITY(quality, resolution, fps[quality])}\n${base_url}/${quality}/index-dvr.m3u8`).join('')}`;
    });
}
/**
 * Create url with access token.
 * @param url
 * @param access_token
 */
function prepareUrl(url, access_token) {
    const dom_url = new URL(url);
    dom_url.search = new URLSearchParams({
        sig: access_token.signature,
        token: access_token.value,
        allow_source: "true",
        player: "twitchweb",
        allow_spectre: "true",
        allow_audio_only: "true"
    }).toString();
    return dom_url.toString();
}
