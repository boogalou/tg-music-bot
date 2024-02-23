import axios, { AxiosInstance, AxiosResponse } from "axios";
import { inject, injectable } from "inversify";
import { TYPES } from "../../app/di/types";
import { ILogger } from "../../app/config/logger/ILogger";
import { IEnvConfigService } from "../../app/config/env/IEnvConfigService";
import { TrackTitle } from "../../domain/entities/TrackTitle";
import { IAudioTrackResponse } from "../../domain/entities/IAudioTrackResponse";
import { IRemoteService } from "./IRemoteService";
import { YoutubeApiResponse } from "../../domain/entities/IYoutubeResponse";
import {
  MusixmatchApiResponseTrack,
  MusixmatchApiResponseTrackLyrics
} from "../../domain/entities/IMusixmatchResponse";
import { TrackLyrics } from "../../domain/entities/TrackLyrics";


@injectable()
export class RemoteService implements IRemoteService {
  private VK: AxiosInstance;
  private youtube: AxiosInstance;
  private musixmatch: AxiosInstance;
  private readonly vkSearchParams: {
    count: 3,
    auto_complete: 1,
    sort: 2,
    offset: 5,
  };
  private readonly youtubeSearchParams: {
    part: 'snippet',
    type: 'video',
    maxResults: 10,
  };


  constructor(
    @inject(TYPES.ILogger) private readonly logger: ILogger,
    @inject(TYPES.IConfigService) private readonly envConfigService: IEnvConfigService,
  ) {
    this.VK = axios.create({
      baseURL: 'https://api.vk.com/method',
      timeout: 10000,
      params: {
        access_token: this.envConfigService.get('KATE_TOKEN'),
        v: '5.131',
      },
      headers: {
        'User-Agent': this.envConfigService.get('KATE_USER_AGENT')!
      }
    });

    this.youtube = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3',
      params: {
        key: envConfigService.get('YOUTUBE_TOKEN'),
      },

    })

    this.musixmatch = axios.create({
      baseURL: 'https://api.musixmatch.com/ws/1.1',
      params: {
        apikey: this.envConfigService.get('MUSIXMATCH_TOKEN'),
      }
    })
  }

  async searchAudioTrack(trackTitle: TrackTitle): Promise<AxiosResponse<IAudioTrackResponse>> {
    try {
      return await this.VK.get('/audio.search', {
        params: {
          ...this.vkSearchParams,
          q: trackTitle,

        }
      });
    } catch (error) {
      throw Error('message')
    }
  };

  async searchMusicVideo(trackTitle: TrackTitle): Promise<AxiosResponse<YoutubeApiResponse>> {
    return await this.youtube.get('/search', {
      params: {
        ...this.youtubeSearchParams,
        q: trackTitle,
      }
    })
  };

  async searchLyrics(trackTitle: TrackTitle): Promise<TrackLyrics> {
    console.log('TRACK_TITLE: ', trackTitle)
    const response: AxiosResponse<MusixmatchApiResponseTrack> = await this.musixmatch.get('/track.search', {
      params: { q: trackTitle }
    })
    console.log(response.data.message.body.track_list[0].track)
    const trackId = response.data.message.body.track_list[0].track.track_id;

   return await this.getLyrics(trackId);

  }

  private async getLyrics(trackId: number): Promise<string>  {
    try {
      const response: AxiosResponse<MusixmatchApiResponseTrackLyrics> = await this.musixmatch.get('/track.lyrics.get', {
        params: { track_id: trackId }
      });

      if (response.data.message.header.status_code !== 200) {
        throw Error('Musixmatch API returned non-200 status code');
      }

      return response.data.message.body.lyrics.lyrics_body;
    } catch (err) {
      throw Error('Failed to fetch lyrics from Musixmatch API')
    }
  }
}