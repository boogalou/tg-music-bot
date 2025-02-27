import { inject, injectable } from "inversify";
import axios, { AxiosInstance } from "axios";

import { TYPES } from "../../di/types";
import { IEnvConfigService } from "../services/config/env/IEnvConfigService";
import { ILogger } from "../services/config/logger/ILogger";
import { IMusicVideoProvider } from "../../domain/repositories/IMusicVideoProvider";

@injectable()
export class MusicVideoProvider implements IMusicVideoProvider {
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

  async getMusicVideo(trackTitle: string): Promise<string> {
    const response = await this.youtube.get('/search', {
      params: {
        part: 'snipet',
        type: 'video',
        maxResults: 10,
        q: trackTitle
      }
    });
    console.log(response.data[0].id.videoId)
    return response.data.items[0].id.videoId;
  }
}