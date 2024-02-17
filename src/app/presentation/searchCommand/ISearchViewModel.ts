import { TrackTitle } from "../../../domain/entities/TrackTitle";
import { Track } from "../../../domain/entities/Track";
import { VideoId } from "../../../domain/entities/VideoId";
import { TrackLyrics } from "../../../domain/entities/TrackLyrics";


export interface ISearchViewModel {

  searchAudioTrack: (trackName: TrackTitle) => Promise<Track[]>;

  searchMusicVideo: (trackName: TrackTitle) => Promise<VideoId>;

  searchLyrics: (trackTitle: TrackTitle) => Promise<TrackLyrics>

  getTrackList: () => Readonly<Track[]>;

}