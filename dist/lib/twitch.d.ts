/// <reference types="node" />
/**
 * Get infos of a specific VOD
 * @param vod_id id of the VOD
 */
export declare function getVodInfos(vod_id: number): Promise<twitch.VODInfos>;
/**
 * Get m3u8 file url.
 * @param vod_id id of the vod
 */
export declare function getM3u8(vod_id: number): Promise<string>;
/**
 * Get m3u8 ts file buffer.
 * @param url url of the ts file
 * @param access_token
 */
export declare function getTsBuffer(url: string, access_token: twitch.AccessToken): Promise<Buffer>;
/**
 * Get access token to a specific VOD.
 * @param vod_id id of the VOD
 */
export declare function getAccessToken(vod_id: number): Promise<twitch.AccessToken>;
/**
 * Get m3u8 file content.
 * @param url
 * @param access_token
 */
export declare function getM3u8Content(url: string, access_token: twitch.AccessToken): Promise<string>;
//# sourceMappingURL=twitch.d.ts.map