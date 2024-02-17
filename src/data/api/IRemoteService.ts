import { TrackTitle } from "../../domain/entities/TrackTitle";
import { AxiosResponse } from "axios";
import { IAudioTrackResponse } from "../../domain/entities/IAudioTrackResponse";
import { YoutubeApiResponse } from "../../domain/entities/IYoutubeResponse";
import { TrackLyrics } from "../../domain/entities/TrackLyrics";


export interface IRemoteService {

  searchAudioTrack: (trackTitle: TrackTitle) => Promise<AxiosResponse<IAudioTrackResponse>>;

  searchMusicVideo: (trackTitle: TrackTitle) =>  Promise<AxiosResponse<YoutubeApiResponse>>;

  searchLyrics: (trackTitle: TrackTitle) => Promise<TrackLyrics>;
}