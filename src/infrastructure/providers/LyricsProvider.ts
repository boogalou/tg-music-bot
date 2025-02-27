import { inject, injectable } from "inversify";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { TYPES } from "../../di/types";
import { IEnvConfigService } from "../services/config/env/IEnvConfigService";
import { ILogger } from "../services/config/logger/ILogger";

import {
  MusixmatchApiResponseTrack,
  MusixmatchApiResponseTrackLyrics
} from "../../domain/models/IMusixmatchResponse";
import { ILyricsProvider } from "../../domain/repositories/ILyricsProvider";

@injectable()
export class LyricsProvider implements ILyricsProvider{
  private musixmatch: AxiosInstance;

  constructor(
    @inject(TYPES.IConfigService)
    private readonly configService: IEnvConfigService,
    @inject(TYPES.ILogger)
    private readonly logger: ILogger,
  ) {

    this.musixmatch = axios.create({
      baseURL: 'https://api.musixmatch.com/ws/1.1',
      params: {
        apikey: this.configService.get('MUSIXMATCH_TOKEN'),
      }
    });
  }

  public async getLyrics(trackTitle: string): Promise<string> {
    return await this.findTrackByTitle(trackTitle);
  }

  private async findTrackByTitle(trackTitle: string): Promise<string> {
    const response: AxiosResponse<MusixmatchApiResponseTrack> = await this.musixmatch.get('/track.search', {
      params: { q: trackTitle }
    })

    const trackId = response.data.message.body.track_list[0].track.track_id;

    return await this.getLyricsById(trackId);

  }

  private async getLyricsById(trackId: number): Promise<string>  {
    try {
      const response: AxiosResponse<MusixmatchApiResponseTrackLyrics> = await this.musixmatch.get('/track.lyrics.get', {
        params: { track_id: trackId }
      });

      if (response.data.message.header.status_code !== 200) {
        throw new Error('Musixmatch API returned non-200 status code');
      }

      return response.data.message.body.lyrics.lyrics_body;
    } catch (err) {
      throw Error('Failed to fetch lyrics from Musixmatch API')
    }
  }
}