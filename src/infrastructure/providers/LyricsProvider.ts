import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { injectable, inject } from 'inversify';


import { ILyricsProvider } from "../../domain/repositories/ILyricsProvider";
import { TYPES } from "../../di/types";
import { IEnvConfigService } from "../interfaces/IEnvConfigService";
import { ILogger } from "../interfaces/ILogger";
import {
  MusixmatchApiResponseTrack,
  MusixmatchApiResponseTrackLyrics
} from "../types/IMusixmatchResponse";

@injectable()
export class LyricsProvider implements ILyricsProvider {
  private musixmatch: AxiosInstance;

  constructor(
    @inject(TYPES.IConfigService)
    private readonly configService: IEnvConfigService,
    @inject(TYPES.ILogger)
    private readonly logger: ILogger
  ) {
    this.musixmatch = axios.create({
      baseURL: 'https://api.musixmatch.com/ws/1.1',
      params: {
        apikey: this.configService.get('MUSIXMATCH_TOKEN'),
        page_size: 1,
        s_track_rating: 'desc',
      },
    });
  }

  public async getLyrics(trackTitle: string): Promise<string> {
    return await this.findTrackByTitle(trackTitle);
  }

  private async findTrackByTitle(trackTitle: string): Promise<string> {
    try {
      const response: AxiosResponse<MusixmatchApiResponseTrack> = await this.musixmatch.get('/track.search', {
        params: { q_track: trackTitle },
      });

      if (!response.data.message.body.track_list.length) {
        this.logger.warn(`No track found for: ${ trackTitle }`);
        throw new Error('Track not found');
      }

      const trackId = response.data.message.body.track_list[0].track.track_id;
      return await this.getLyricsById(trackId);
    } catch (err) {
      this.logger.error(`Error finding track: ${ trackTitle }`, err);
      throw new Error('Failed to find track');
    }
  }

  private async getLyricsById(trackId: number): Promise<string> {
    try {
      const response: AxiosResponse<MusixmatchApiResponseTrackLyrics> = await this.musixmatch.get('/track.lyrics.get', {
        params: {
          track_id: trackId
        },
      });

      if (response.data.message.header.status_code !== 200) {
        this.logger.warn(`Musixmatch API error: ${ response.data.message.header.status_code }`);
        throw new Error(`Musixmatch API returned status ${ response.data.message.header.status_code }`);
      }

      return response.data.message.body.lyrics.lyrics_body;
    } catch (err: any) {
      this.logger.error(`Failed to fetch lyrics for track ID: ${ trackId }`, err.response?.data || err.message);
      throw new Error('Failed to fetch lyrics from Musixmatch API');
    }
  }
}
