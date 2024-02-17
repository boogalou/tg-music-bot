import { ITrackRepository } from "../../domain/repositories/ITrackRepository";
import { TrackTitle } from "../../domain/entities/TrackTitle";
import { Track } from "../../domain/entities/Track";
import { inject, injectable } from "inversify";
import { TYPES } from "../../app/di/types";
import { IRemoteService } from "../api/IRemoteService";
import { AxiosResponse } from "axios";
import { IAudioTrackResponse } from "../../domain/entities/IAudioTrackResponse";
import { VideoId } from "../../domain/entities/VideoId";
import { TrackLyrics } from "../../domain/entities/TrackLyrics";


@injectable()
export class TrackRepositoryImpl implements ITrackRepository {

  constructor(
    @inject(TYPES.IRemoteService) private readonly remoteService: IRemoteService,
  ) {
  };

  async getAudioTrack(trackTitle: TrackTitle) {
    const response = await this.remoteService.searchAudioTrack(trackTitle);

    const trackList = response.data.response.items;

    if (trackList.length === 0) return [];

    return trackList
      .slice(0, 3)
      .map((trackItem, trackId) => {
        return {
          id: ++trackId,
          filename: `${ trackItem.artist } - ${ trackItem.title }`,
          url: trackItem.url,
        }
      });

  };

  async getMusicVideo(trackTitle: TrackTitle): Promise<VideoId> {

    const response = await this.remoteService.searchMusicVideo(trackTitle);

    return response.data.items[0].id.videoId;
  };

  async searchLyrics(trackTitle: TrackTitle): Promise<TrackLyrics> {
    return await this.remoteService.searchLyrics(trackTitle);
  };
}