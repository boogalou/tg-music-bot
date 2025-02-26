export interface ILyricsProvider {
  getLyrics: (trackTitle: string) => Promise<string>;
}