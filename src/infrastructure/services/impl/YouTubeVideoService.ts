import { inject, injectable } from "inversify";
import axios, { AxiosInstance } from "axios";

import { IYouTubeVideoService } from "../IYouTubeVideoService";
import { TYPES } from "../../../di/types";
import { IEnvConfigService } from "../config/env/IEnvConfigService";
import { ILogger } from "../config/logger/ILogger";

@injectable()
export class YouTubeVideoService implements IYouTubeVideoService {
  private youtube: AxiosInstance;

  constructor(
    @inject(TYPES.IConfigService)
    private readonly configService: IEnvConfigService,
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,

  ) {
    this.youtube = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3',
      params: { key: this.configService.get('YOUTUBE_TOKEN') },
    });
  }

  async searchMusicVideo(trackTitle: string) {
    const response = await this.youtube.get('/search', {
      params: { part: 'snipet', type: 'video', maxResults: 19, q: trackTitle }
    });

    return response.data.items[0].id.videoId;
  }
}