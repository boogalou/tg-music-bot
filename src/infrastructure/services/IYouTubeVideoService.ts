export interface IYouTubeVideoService {
  searchMusicVideo(trackTitle: string): Promise<string>;
}