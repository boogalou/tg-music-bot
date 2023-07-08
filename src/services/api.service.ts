import "dotenv/config"
import axios, {AxiosResponse} from "axios";

import {ResponseData} from "../types/response.interface";


export const getMusicByUserId = async (userID: string): Promise<AxiosResponse<ResponseData>> => {
  const url = `https://api.vk.com/method/audio.get`;
  try {
    return await axios.get(url, {
      params: {
        access_token: process.env.KATE_TOKEN!,
        owner_id: userID,
        v: '5.131',
      },
      headers: {
        'User-Agent': process.env.KATE_USER_AGENT!,
      }
    })
  } catch (error) {
    console.error(error)
    throw new Error('search api error');
  }
}

export const search = async (request: string): Promise<AxiosResponse> => {
  const url = `https://api.vk.com/method/audio.search`;
  try {
    return await axios.get<ResponseData>(url, {
      params: {
        q: request,
        count: 3,
        auto_complete: 1,
        sort: 2,
        offset: 5,
        access_token: process.env.KATE_TOKEN!,
        v: '5.131',
      },
      headers: {
        'User-Agent': process.env.KATE_USER_AGENT!,
      },
    });
  } catch (error) {
    console.error(error)
    throw new Error('search api error');
  }
};

export const searchYouTube = async (request: string): Promise<AxiosResponse> => {
  const url = 'https://www.googleapis.com/youtube/v3/search';
  try {
    return await axios.get(url, {
      params: {
        q: request,
        part: 'snippet',
        type: 'video',
        maxResults: 10,
        key: process.env.YOUTUBE_TOKEN,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('youtube api error');
  }
};

export const findLyrics = async (trackId: string) => {
  const url = 'http://api.musixmatch.com/ws/1.1/';
  const apiKey: string | undefined = process.env.MUSIXMATCH_TOKEN;
  return await axios.get(url + `track.lyrics.get`, {
    params: {
      track_id: trackId,
      apikey: apiKey,
    }
  })
}

export const getLyrics = async (request: string) => {
  const url = 'http://api.musixmatch.com/ws/1.1/'
  const apiKey: string | undefined = process.env.MUSIXMATCH_TOKEN;
  try {
    const response: AxiosResponse = await axios.get(url + 'track.search', {
      params: {
        q: request,
        apikey: apiKey,
      }
    });

    const data = await response.data;

    if (data['message']['header'].status_code !== 200) {
      return undefined;
    }
    const trackId = data['message']['body']['track_list'][0]['track']['track_id'];
    const result = await findLyrics(trackId);
    const lyrics = result.data['message']['body']['lyrics']['lyrics_body'];
    return lyrics;
  } catch (error) {
    console.error(error);
    throw new Error('lyrics api error');
  }
}
