import { inject, injectable } from "inversify";
import { TrackRepositoryImpl } from "../../../data/repositories/TrackRepositoryImpl";
import { GetAudioTrackUseCase } from "../../../domain/usecases/GetAudioTrackUseCase";
import { TYPES } from "../../di/types";
import { TrackTitle } from "../../../domain/entities/TrackTitle";
import { GetMusicVideoUseCase } from "../../../domain/usecases/GetMusicVideoUseCase";
import { SearchLyricsUseCase } from "../../../domain/usecases/SearchLyricsUseCase";
import { ISearchViewModel } from "./ISearchViewModel";
import { Track } from "../../../domain/entities/Track";
import { VideoId } from "../../../domain/entities/VideoId";
import { TrackLyrics } from "../../../domain/entities/TrackLyrics";


@injectable()
export class SearchViewModel implements ISearchViewModel {

  private trackList: Track[] = [];

  private readonly repository: TrackRepositoryImpl;
  private readonly searchAudioTrackUseCase: GetAudioTrackUseCase;
  private readonly searchMusicVideoUseCase: GetMusicVideoUseCase;
  private readonly searchLyricsUseCase: SearchLyricsUseCase;


  constructor(@inject(TYPES.TrackRepository) repository: TrackRepositoryImpl) {
    this.repository = repository;
    this.searchAudioTrackUseCase = new GetAudioTrackUseCase(this.repository);
    this.searchMusicVideoUseCase = new GetMusicVideoUseCase(this.repository);
    this.searchLyricsUseCase = new SearchLyricsUseCase(this.repository);
  }


  async searchAudioTrack(trackTitle: TrackTitle) {
    const response = await this.searchAudioTrackUseCase.execute(trackTitle);

    this.setTrackList(response);

    return response;
  };

  async searchMusicVideo(trackTitle: TrackTitle): Promise<VideoId> {
    return await this.searchMusicVideoUseCase.execute(trackTitle);

  };

  async searchLyrics(trackTitle: TrackTitle): Promise<TrackLyrics> {
    return await this.searchLyricsUseCase.execute(trackTitle);
  }

  getTrackList() {
    return [...this.trackList.map(item => Object.freeze(item))];
  };

  private setTrackList(value: Track[]) {
    this.trackList = value;
    return this.trackList
  };
}