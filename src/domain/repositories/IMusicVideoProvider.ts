export interface IMusicVideoProvider {
  getMusicVideo: (trackTitle: string) => Promise<string>;
}