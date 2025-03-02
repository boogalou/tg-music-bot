export type MusixmatchApiResponseTrack = {
  message: {
    header: {
      status_code: number;
      execute_time: number;
      available: number;
    },

    body: {
      track_list: MusixmatchTrackItem[];
    },
  }
}

export type MusixmatchTrackItem = {
  track: {
    track_id: number;
    track_name: string;
    track_name_translation_list: [];
    track_rating: number;
    commontrack_id: number;
    instrumental: number;
    explicit: number;
    has_lyrics: number;
    has_subtitles: number;
    has_richsync: number;
    num_favourite: number;
    album_id: number;
    album_name: string;
    artist_id: number;
    artist_name: string;
    track_share_url: string;
    track_edit_url: string;
    restricted: number;
    updated_time: Date;
  }
}

export type MusixmatchApiResponseTrackLyrics = {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    },

    body: {
      lyrics: {
        lyrics_id: number;
        restricted: number;
        instrumental: number;
        lyrics_body: string;
        lyrics_language: string;
        script_tracking_url: string;
        pixel_tracking_url: string;
        lyrics_copyright: string;
        backlink_url: string;
        updated_time: Date;
      },
    }
  },
}