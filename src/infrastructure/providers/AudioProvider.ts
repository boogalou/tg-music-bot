import axios, { AxiosInstance, AxiosResponse, isAxiosError } from "axios";
import { inject, injectable } from "inversify";

import { IAudioTrackResponse } from "../types/IAudioTrackResponse";
import { TYPES } from "../../di/types";
import { ILogger } from "../interfaces/ILogger";
import { IEnvConfigService } from "../interfaces/IEnvConfigService";
import { Track } from "../../domain/models/Track";
import { IAudioProvider } from "../../domain/repositories/IAudioProvider";

@injectable()
export class AudioProvider implements IAudioProvider {
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

  async getMusicTrack(trackTitle: string): Promise<Track[]> {
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
      }

      return trackList.slice(0, 3).map((trackItem, trackId) => {
        return {
          id: trackId + 1,
          filename: `${trackItem.artist} - ${trackItem.title}`,
          url: trackItem.url,
        }
      });

    } catch (error) {
      // Обработка ошибок Axios
      if (isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message || error.message;

        if (statusCode) {
          this.logger.error(`Axios error with status code: ${statusCode}, message: ${errorMessage}`);
          throw new Error(`Request failed with status code ${statusCode}: ${errorMessage}`);
        }

        this.logger.error(`Axios error: ${errorMessage}`);
        throw new Error(`Search failed: ${errorMessage}`);
      }

      // Обработка ошибок, возникающих при поиске
      if (error instanceof Error) {
        if (error.message === 'Track not found') {
          this.logger.warn(`No track found for title: ${trackTitle}`);
          throw error; // Прокидываем ошибку дальше
        }

        this.logger.error(`Unknown error: ${error.message}`);
        throw new Error(`Search failed: ${error.message}`);
      }

      // Ловим все прочие ошибки
      this.logger.error('An unknown error occurred');
      throw new Error('Search failed: Unknown error');
    }
  }
}
