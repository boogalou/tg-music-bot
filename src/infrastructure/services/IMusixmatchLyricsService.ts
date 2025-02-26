export interface IMusixmatchLyricsService {
  searchLyrics(trackTitle: string): Promise<string>;
}