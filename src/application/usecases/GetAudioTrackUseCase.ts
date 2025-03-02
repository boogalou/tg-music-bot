import { inject, injectable } from "inversify";

import { Track } from "../../domain/models/Track";
import { IAudioProvider } from "../../domain/repositories/IAudioProvider";
import { IGetAudioTrackUseCase } from "../interfaces/IGetAudioTrackUseCase";
import { TYPES } from "../../di/types";


@injectable()
export class GetAudioTrackUseCase implements IGetAudioTrackUseCase{
  constructor(
    @inject(TYPES.IAudioProvider)
    private readonly provider: IAudioProvider,
  ) {}

  async execute(titleTrack: string): Promise<Track[]> {
    return await this.provider.getMusicTrack(titleTrack);
  }
}