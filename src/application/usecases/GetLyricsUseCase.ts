import { TrackTitle } from "../../domain/models/TrackTitle";
import { TrackLyrics } from "../../domain/models/TrackLyrics";
import { ILyricsProvider } from "../../domain/repositories/ILyricsProvider";


export class GetLyricsUseCase {
  constructor(private readonly repository: ILyricsProvider) {}

   async execute(trackTitle: TrackTitle): Promise<TrackLyrics> {
     return await this.repository.getLyrics(trackTitle);
  }
}