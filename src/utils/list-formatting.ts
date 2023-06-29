import {Tracklist} from "../types/tracklist.interface";


export function listFormatting(list: Tracklist[]): string {
  return list.map((track, index) => (
      `<strong>${++index}. ${track?.filename}</strong>\n`
  )).join('');
};
