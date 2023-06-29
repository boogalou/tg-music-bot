import "dotenv/config"
import axios, {Axios, AxiosResponse} from "axios";

// @ts-ignore
import { getLyrics, getSong } from 'genius-lyrics-api';
import {ResponseData} from "../types/response.interface";


export const getMusicByUserId = async (userID: string): Promise<AxiosResponse<ResponseData>> => {
  const url = `https://api.vk.com/method/audio.get`;
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
}

export const search = async (request: string): Promise<AxiosResponse> => {
  const url = `https://api.vk.com/method/audio.search`;
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
};

export const searchYouTube = async (request: string): Promise<AxiosResponse> => {
  const url = 'https://www.googleapis.com/youtube/v3/search';
  console.log(request);
  return await axios.get(url, {
    params: {
      q: request,
      part: 'snippet',
      type: 'video',
      maxResults: 10,
      key: process.env.YOUTUBE_TOKEN,
    },
  });
};


export const getLyricsGenius = async (request: string) => {
  const options = {
    apiKey: process.env.GENIUS_TOKEN,
    title: request,
    artist: request,
    optimizeQuery: true,
  }

  return await getLyrics(options)
}