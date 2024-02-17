import { TrackTitle } from "../entities/TrackTitle";
import { ITrackRepository } from "../repositories/ITrackRepository";
import { VideoId } from "../entities/VideoId";


export class GetMusicVideoUseCase {

  constructor(private readonly trackRepository: ITrackRepository) {
  }

 async execute(trackTitle: TrackTitle): Promise<VideoId> {
    return await this.trackRepository.getMusicVideo(trackTitle);
  }
}