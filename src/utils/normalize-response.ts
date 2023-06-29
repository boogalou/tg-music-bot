import {ResponseData} from '../types/response.interface';
import {Tracklist} from "../types/tracklist.interface";

export function normalizeResponse({ response }: ResponseData): Tracklist[]{
  const { items } = response;

  console.log(items)

  const tracks = items.map((track) => {
    if (!track.url) {
      return null;
    }

    return {
      url: track.url,
      filename: `${track.artist} - ${track.title}`,
    };
  }).filter(Boolean);

  console.log(tracks);


    return tracks as Tracklist[];

}
