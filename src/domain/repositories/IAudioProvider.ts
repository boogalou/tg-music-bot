import { Track } from "../models/Track";

export interface IAudioProvider {
  getMusicTrack: (trackTitle: string) => Promise<Track[]>;
}