import { TrackTitle } from "../entities/TrackTitle";
import { ITrackRepository } from "../repositories/ITrackRepository";
import { TrackLyrics } from "../entities/TrackLyrics";


export class SearchLyricsUseCase {

  constructor(private readonly trackRepository: ITrackRepository) {}

   async execute(trackTite: TrackTitle): Promise<TrackLyrics> {
     return await this.trackRepository.searchLyrics(trackTite);
  }
}