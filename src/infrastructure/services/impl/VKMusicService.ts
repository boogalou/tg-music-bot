import axios, { AxiosInstance, AxiosResponse, isAxiosError } from "axios";
import { inject, injectable } from "inversify";

import { IAudioTrackResponse } from "../../../domain/models/IAudioTrackResponse";
import { TYPES } from "../../../di/types";
import { ILogger } from "../config/logger/ILogger";
import { IEnvConfigService } from "../config/env/IEnvConfigService";
import { IVKMusicService } from "../IVKMusicService";
import { Track } from "../../../domain/models/Track";

@injectable()
export class VKMusicService implements IVKMusicService {
  private vk: AxiosInstance;

  constructor(
    @inject(TYPES.IConfigService)
    private readonly configService: IEnvConfigService,
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
  ) {
    this.vk = axios.create({
      baseURL: 'https://api.vk.com/method',
      timeout: 10000,
      params: {
        access_token: this.configService.get('KATE_TOKEN'),
        v: '5.131',
      },
      headers: {
        'User-Agent': this.configService.get('KATE_USER_AGENT')!
      }
    });
  }

  async searchAudioTrack(trackTitle: string): Promise<Track[]> {
    try {
      const response: AxiosResponse<IAudioTrackResponse> = await this.vk.get('/audio.search', {
        params: {
          count: 3,
          auto_complete: 1,
          sort: 2,
          offset: 5,
          q: trackTitle,

        }
      });

      const trackList = response.data.response.items;

      if (!trackList.length) {
        throw new Error('Track not found');
      };

      return trackList.slice(0, 3).map((trackItem, trackId) => {
        return {
          id: trackId + 1,
          filename: `${ trackItem.artist } - ${ trackItem.title }`,
          url: trackItem.url,
        }
      });

    } catch (error) {
      if (error instanceof Error && error.message === 'Track not found') {
        throw error;
      }

      if (isAxiosError(error)) {
        throw new Error(`Search failed: ${error.response?.data?.message || error.message}`);
      }

      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
}