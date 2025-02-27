import { Track } from "../../domain/models/Track";

export interface IGetAudioTrackUseCase {
  execute(trackTitle: string): Promise<Track[]>;
}