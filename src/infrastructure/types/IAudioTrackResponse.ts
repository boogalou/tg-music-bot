export interface IAudioTrackResponse {
    response: AudiTrackData
}

interface AudiTrackData {
    count: number
    items: TrackItem[]
}


export interface TrackItem {
    artist: string;
    id: number;
    owner_id: number;
    title: string;
    duration: number;
    access_key: string;
    ads: Ads;
    is_explicit: boolean;
    is_focus_track: boolean;
    is_licensed: boolean;
    track_code: string;
    url: string;
    date: number;
    genre_id: number;
    short_videos_allowed: boolean;
    stories_cover_allowed: boolean;
}

interface Ads {
    content_id: string;
    duration: string;
    account_age_type: string;
    puid1: string;
    puid22: string;
}