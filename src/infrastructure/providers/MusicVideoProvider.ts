import { inject, injectable } from "inversify";
import axios, { AxiosInstance } from "axios";

import { TYPES } from "../../di/types";
import { IEnvConfigService } from "../interfaces/IEnvConfigService";
import { ILogger } from "../interfaces/ILogger";
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
      params: {
        key: this.configService.get('YOUTUBE_TOKEN'),
        part: 'snippet',
        type: 'video',
        maxResults: 10,
      },
    });
  }

  async getMusicVideo(trackTitle: string): Promise<string> {
    try {
      const response = await this.youtube.get('/search', {
        params: { q: trackTitle }
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error(`No videos found for track: ${ trackTitle }`);
      }

      return response.data.items[0].id.videoId;
    } catch (error) {
      this.logger.error('Error fetching music video: ', error);
      throw new Error(`Failed to fetch music video for track: ${ trackTitle }. Please try again later.`);
    }
  }
}