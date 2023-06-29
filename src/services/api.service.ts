import "dotenv/config"
import axios, {AxiosResponse} from "axios";

// @ts-ignore
import {getLyrics, getSong} from 'genius-lyrics-api';
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
  console.log(request);
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
    console.error(error)
    throw new Error('youtube api error');
  }
};

export const getLyricsGenius = async (request: string) => {
  try {
    const options = {
      apiKey: process.env.GENIUS_TOKEN,
      title: request,
      artist: request,
      optimizeQuery: true,
    }

    return await getLyrics(options)
  } catch (error) {
    console.error(error);
    throw new Error('lyrics api error');
  }
}