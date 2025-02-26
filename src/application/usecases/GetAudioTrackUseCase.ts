import { injectable } from "inversify";


import { TrackTitle } from "../../domain/models/TrackTitle";
import { Track } from "../../domain/models/Track";
import { IAudioProvider } from "../../domain/repositories/IAudioProvider";


@injectable()
export class GetAudioTrackUseCase {
  constructor(
    private readonly provider: IAudioProvider
  ) {}

  async execute(titleTrack: TrackTitle): Promise<Track[]> {
    return await this.provider.getAudioTrack(titleTrack);
  }
}