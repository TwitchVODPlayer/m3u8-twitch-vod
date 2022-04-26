namespace twitch {
    interface AccessToken {
        signature: string
        value: string
    }
    interface M3U8 {
        content: string
        base_url: string
    }
    interface VODInfos {
        _id: string
        channel: Channel
        title: string
        description?: string
        description_html?: null
        broadcast_id: number
        broadcast_type: string
        status: string
        tag_list?: string
        views: number
        url: string
        language: string
        created_at: string
        viewable: string
        viewable_at?: string
        published_at?: string
        delete_at?: string
        recorded_at?: string
        game?: string
        length: number
        restriction: string
        preview: {
            small: string
            medium: string
            large: string
            template: string
        }
        animated_preview_url: string
        thumbnails: {
            small: Array<Thumbnail>
            medium: Array<Thumbnail>
            large: Array<Thumbnail>
            template: Array<Thumbnail>
        }
        seek_previews_url?: string
        fps: FPS
        resolutions: Resolutions
        increment_view_count_url: string
    }
    interface FPS {
        "160p30": number
        "360p30": number
        "480p30": number
        "720p30": number
        "720p60": number
        "1080p30": number
        "1080p60": number
        [chunked: string]: number
    }
    interface Channel {
        _id: number
        name: string
        display_name: string
        game?: string
        language: string
        description?: string
        url: string
        views: number
        followers: number
        mature: boolean
        status: string
        broadcaster_language: string
        broadcaster_software: string
        created_at: string
        updated_at: string
        partner: boolean
        logo: string
        video_banner?: string
        profile_banner?: string
        profile_banner_background_color: string
        broadcaster_type: string
        private_video: boolean
        privacy_options_enabled: boolean
    }
    interface Resolutions {
        "160p30": string
        "360p30": string
        "480p30": string
        "720p30": string
        "720p60": string
        "1080p30": string
        "1080p60": string
        [chunked: string]: string
    }
    interface Thumbnail {
        type: string
        url: string
    }
    interface Bandwidths {
        "160p30": number
        "360p30": number
        "480p30": number
        "720p30": number
        "720p60": number
        "1080p30": number
        "1080p60": number
        "1440p30": number
        "1440p60": number
        [chunked: string]: number
    }
}
