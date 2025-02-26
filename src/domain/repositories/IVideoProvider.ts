export interface IVideoProvider {
  getMusicVideo: (trackTitle: string) => Promise<string>;
}