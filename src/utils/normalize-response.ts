import {TrackItem} from '../domain/entities/IAudioTrackResponse';
import {Tracklist} from "../types/tracklist.interface";

export function normalizeResponse(items: TrackItem[]): Tracklist[]{
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
