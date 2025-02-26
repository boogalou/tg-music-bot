import { injectable } from "inversify";

import { TrackTitle } from "../../domain/models/TrackTitle";
import { VideoId } from "../../domain/models/VideoId";
import { IVideoProvider } from "../../domain/repositories/IVideoProvider";


@injectable()
export class GetMusicVideoUseCase {

  constructor(

    private readonly repository: IVideoProvider) {
  }

 async execute(trackTitle: TrackTitle): Promise<VideoId> {
    return await this.repository.getMusicVideo(trackTitle);
  }
}