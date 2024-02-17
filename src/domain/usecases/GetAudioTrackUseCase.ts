import { ITrackRepository } from "../repositories/ITrackRepository";
import { TrackTitle } from "../entities/TrackTitle";
import { injectable } from "inversify";
import { AxiosResponse } from "axios";
import { IAudioTrackResponse, TrackItem } from "../entities/IAudioTrackResponse";
import { Track } from "../entities/Track";


@injectable()
export class GetAudioTrackUseCase {
  constructor(private readonly trackRepository: ITrackRepository) {}

  async execute(titleTrack: TrackTitle): Promise<Track[]> {
    return await this.trackRepository.getAudioTrack(titleTrack);
  }
}