import { Track } from "../models/Track";

export interface IAudioProvider {
  getAudioTrack: (trackTitle: string) => Promise<Track[]>;
}