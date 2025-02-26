import { Track } from "../../domain/models/Track";

export interface IVKMusicService {
  searchAudioTrack(trackTitle: string): Promise<Track[]>;
}