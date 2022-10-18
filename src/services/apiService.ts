import "dotenv/config"
import axios, { Axios, AxiosResponse } from "axios";
import { ResponseData } from "../types";


export const getMusic = async (userID: string): Promise<AxiosResponse<ResponseData>> => {
  const getMusicByUserId = `https://api.vk.com/method/audio.get`;
  return await axios.get(getMusicByUserId, {
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

export const getSearch = async (request: string): Promise<AxiosResponse<ResponseData>> => {
  const searchMethod = `https://api.vk.com/method/audio.search`;
  return await axios.get(searchMethod, {
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
    }
  })
}