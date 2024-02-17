import { TrackTitle } from "../entities/TrackTitle";
import { AxiosResponse } from "axios";
import { IAudioTrackResponse, TrackItem } from "../entities/IAudioTrackResponse";
import { Track } from "../entities/Track";
import { VideoId } from "../entities/VideoId";
import { TrackLyrics } from "../entities/TrackLyrics";


export interface ITrackRepository {

  getAudioTrack: (trackTitle: TrackTitle) => Promise<Track[]>;

  getMusicVideo: (trackTitle: TrackTitle) => Promise<VideoId>;

  searchLyrics: (trackTitle: TrackTitle) => Promise<TrackLyrics>;
}